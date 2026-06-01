import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import SearchBar from '../components/SearchBar';
import SegmentTabs from '../components/SegmentTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import { DEFAULT_TABLE, MOBILE_TABLES, mobileTableByRoute } from '../constants';
import { mobileApi, MobilePost } from '../api';
import DesignIcon from '../components/DesignIcon';
import { mastergoAssets } from '../assets/mastergo';

const HomeSurface = styled.div`
  background: #f9fafc;
`;

const Hero = styled.section`
  position: relative;
  min-height: 266px;
  overflow: hidden;
  padding: 88px 16px 0;
  background: #fff;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 60px;
    background: #d9d9d9;
  }
`;

const SearchWrap = styled.div`
  position: relative;
  z-index: 3;
  margin: 0 16px;
`;

const SearchPageHeader = styled.section`
  position: relative;
  padding: 88px 16px 16px;
  background: #fff;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 60px;
    background: #d9d9d9;
  }
`;

const TableGrid = styled.section`
  padding: 16px 0 10px;
  background: #fff;
  h3 {
    margin: 0 0 13px;
    font-size: 20px;
    font-weight: 700;
    color: #1a202c;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    padding-bottom: 4px;
  }
`;

const TableButton = styled.button`
  min-width: 0;
  min-height: 92px;
  padding: 0 2px;
  text-align: center;
  background: transparent;
  border: 0;
  .table-avatar {
    position: relative;
    width: 50px;
    height: 50px;
    display: grid;
    place-items: center;
    margin: 0 auto;
    border-radius: 18px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45),
      0 8px 18px rgba(254, 152, 0, 0.16);
    overflow: hidden;
  }
  .table-avatar::after {
    content: '';
    position: absolute;
    inset: 6px auto auto 7px;
    width: 18px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.35);
    transform: rotate(-22deg);
  }
  h4 {
    margin: 9px 0 0;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 500;
    color: #1a202c;
    word-break: keep-all;
    .anticon {
      color: #fe9800;
      font-size: 12px;
      margin-top: 4px;
    }
  }
  p {
    display: none;
  }
`;

const PostList = styled.div`
  display: block;
  padding: 0 0 20px;
  background: #fff;
`;

const DetailHero = styled.section`
  position: relative;
  padding: 24px 20px 20px;
  background: #ffedc6;
  border-bottom: 1px solid #efefef;
`;

const TableIntro = styled.div`
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  .cover {
    width: 62px;
    height: 62px;
    border-radius: 6px;
    background: #fff;
  }
  h2 {
    margin: 0 0 6px;
    font-size: 20px;
    line-height: 1.22;
    font-weight: 700;
    color: #1a202c;
  }
  span {
    color: #7f838a;
    font-size: 12px;
  }
`;

const TableDesc = styled.p`
  margin: 0;
  color: #7f838a;
  font-size: 13px;
  line-height: 1.55;
`;

const SortRow = styled.div`
  display: flex;
  gap: 24px;
  padding: 10px 16px 8px;
  background: #fff;
  border-bottom: 1px solid #efefef;
`;

const TableTabsPanel = styled.div`
  margin: 0;
  padding-top: 8px;
  background: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const FeaturedCard = styled.button`
  width: calc(100% - 32px);
  min-height: 90px;
  margin: 10px 16px 14px;
  padding: 12px;
  text-align: left;
  border-radius: 8px;
  background: #fff8e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  .tag {
    color: #fe9800;
    font-size: 12px;
  }
  h3 {
    margin: 8px 0 6px;
    font-size: 14px;
    color: #1a202c;
  }
  p {
    margin: 0;
    color: #7f838a;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SortButton = styled.button<{ active: boolean }>`
  position: relative;
  height: 28px;
  padding: 0;
  background: transparent;
  color: ${(props) => (props.active ? '#fe9800' : '#9ca3af')};
  border: 0;
  font-size: 14px;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -8px;
    height: 2px;
    border-radius: 999px;
    background: ${(props) => (props.active ? '#ffc641' : 'transparent')};
  }
`;

const FloatingEdit = styled.button`
  position: fixed;
  right: 18px;
  bottom: calc(82px + env(safe-area-inset-bottom));
  z-index: 35;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ffc641;
  color: #1a202c;
  font-size: 21px;
  box-shadow: 0 12px 28px rgba(255, 159, 26, 0.32);
  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }
`;

const DetailTopControls = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 28px;
  gap: 10px;
  align-items: center;
  padding: 22px 16px 14px;
  background: #ffedc6;
  .ghost {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    background: transparent;
    color: #fe9800;
  }
`;

const MoreButton = styled.button`
  height: 42px;
  margin: 4px 20px 24px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e6e6e6;
  color: #3d3d3d;
`;

const LoadingPanel = styled.div`
  min-height: 224px;
  display: grid;
  place-items: center;
  background: #fff;
  border-top: 1px solid #f0f1f4;
  color: #8a9099;
`;

const LoadingBubble = styled.div`
  display: grid;
  justify-items: center;
  gap: 12px;
  .spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid rgba(254, 152, 0, 0.16);
    border-top-color: #fe9800;
    animation: mobile-spin 0.86s linear infinite;
  }
  .copy {
    font-size: 13px;
  }
  @keyframes mobile-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const tableVisuals: Record<string, { glyph: string; gradient: string }> = {
  daily: { glyph: '即', gradient: 'linear-gradient(135deg, #ffbc49, #fe9800)' },
  study: { glyph: '学', gradient: 'linear-gradient(135deg, #72a5ff, #4e7fff)' },
  project: { glyph: '赛', gradient: 'linear-gradient(135deg, #7bd79a, #40b978)' },
  emotion: { glyph: '情', gradient: 'linear-gradient(135deg, #ff8f9d, #f05d5e)' },
  campus: { glyph: '校', gradient: 'linear-gradient(135deg, #8ddfd5, #43b7a9)' },
  trade: { glyph: '闲', gradient: 'linear-gradient(135deg, #b7a4ff, #7867d8)' },
};

const Home: React.FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const table = mobileTableByRoute(params.category);
  const activeTable = table || DEFAULT_TABLE;
  const isSearch = pathname === '/search';
  const [posts, setPosts] = useState<MobilePost[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [activeTag, setActiveTag] = useState('全部');
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest');

  const fetchPosts = async (nextPage = 0, append = false) => {
    setLoading(true);
    try {
      const res = await mobileApi.posts.list({
        domain: 'normal',
        limit: 20,
        page: nextPage,
        category: table ? activeTable.apiCategory : undefined,
        search_content: query || undefined,
        tag: activeTag === '全部' ? undefined : activeTag,
        filter: sort === 'hottest' ? 'hot' : '',
      });
      if (res.code !== 0) {
        message.error(res.message);
        return;
      }
      const next = res.data.posts || [];
      setPosts(append ? [...posts, ...next] : next);
      setPage(nextPage);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setLoaded(false);
    fetchPosts(0, false);
  }, [query, params.category, activeTag, sort]);

  return (
    <MobileShell
      title={table ? activeTable.name : '木犀茶馆'}
      back={!!table}
      right={table ? undefined : 'notice'}
      onRight={table ? undefined : () => nav('/notice')}
      showTopBar={!!table}
    >
      <HomeSurface>
        {!table && !isSearch ? (
          <>
            <Hero>
              <SearchWrap>
                <SearchBar
                  defaultValue={query}
                  placeholder="搜索茶馆"
                  onSearch={(value) => nav(value ? `/search?query=${value}` : '/')}
                />
              </SearchWrap>
              <TableGrid>
                <h3>茶桌分类</h3>
                <div className="grid">
                  {MOBILE_TABLES.slice(0, 3).map((item) => (
                    <TableButton key={item.key} onClick={() => nav(`/${item.route}`)}>
                      <span
                        className="table-avatar"
                        style={{ background: tableVisuals[item.key].gradient }}
                      >
                        {tableVisuals[item.key].glyph}
                      </span>
                      <h4>{item.name.replace(/\s+/g, ' ')}</h4>
                      <p>{item.intro}</p>
                    </TableButton>
                  ))}
                </div>
              </TableGrid>
            </Hero>
          </>
        ) : isSearch ? (
          <SearchPageHeader>
            <SearchBar
              defaultValue={query}
              placeholder="搜索茶馆"
              onSearch={(value) => nav(value ? `/search?query=${value}` : '/search')}
            />
          </SearchPageHeader>
        ) : (
          <>
            <DetailTopControls>
              <button className="ghost" type="button" onClick={() => nav(-1)}>
                <img
                  src={mastergoAssets.icons.chevronLeftOrange}
                  alt=""
                  style={{ width: 7, height: 13 }}
                />
              </button>
              <SearchBar
                defaultValue={query}
                placeholder="搜索茶桌"
                onSearch={(value) => nav(value ? `/search?query=${value}` : '/')}
              />
              <button className="ghost" type="button">
                <DesignIcon name="more" size={22} />
              </button>
            </DetailTopControls>
            <DetailHero>
              <TableIntro>
                <span className="cover" />
                <div>
                  <h2>{activeTable.name}</h2>
                  <span>{posts[0]?.comment_num || 0} 评论</span>
                </div>
              </TableIntro>
              <TableDesc>茶桌简介：{activeTable.intro}</TableDesc>
            </DetailHero>
            <TableTabsPanel>
              <SegmentTabs
                value={activeTag}
                items={activeTable.tags.map((tag) => ({ label: tag, value: tag }))}
                onChange={(value) => setActiveTag(String(value))}
              />
              {posts[0] ? (
                <FeaturedCard
                  type="button"
                  onClick={() => posts[0].id && nav(`/article/${posts[0].id}`)}
                >
                  <span className="tag">
                    #{posts[0].tags?.[0] || activeTable.tags[1] || '精选'}{' '}
                    {posts[0].comment_num || 0}讨论
                  </span>
                  <h3>{posts[0].title || '未命名帖子'}</h3>
                  <p>
                    {posts[0].summary ||
                      posts[0].content?.replace(/<[^>]+>/g, '').slice(0, 60) ||
                      '暂无摘要'}
                  </p>
                </FeaturedCard>
              ) : null}
            </TableTabsPanel>
          </>
        )}
      </HomeSurface>

      {isSearch || table ? (
        <SortRow>
          <SortButton active={sort === 'newest'} onClick={() => setSort('newest')}>
            最新
          </SortButton>
          <SortButton active={sort === 'hottest'} onClick={() => setSort('hottest')}>
            热门
          </SortButton>
        </SortRow>
      ) : null}
      {posts.length ? (
        <>
          <PostList>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </PostList>
          <MoreButton disabled={loading} onClick={() => fetchPosts(page + 1, true)}>
            {loading ? '加载中...' : '加载更多'}
          </MoreButton>
        </>
      ) : loading || !loaded ? (
        <LoadingPanel>
          <LoadingBubble>
            <span className="spinner" />
            <span className="copy">正在沏茶...</span>
          </LoadingBubble>
        </LoadingPanel>
      ) : (
        <EmptyState text="还没有帖子" />
      )}
      <FloatingEdit type="button" onClick={() => nav(`/editor/article${Date.now()}`)}>
        <img src={mastergoAssets.icons.addSmall} alt="" />
      </FloatingEdit>
    </MobileShell>
  );
};

export default Home;
