import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import SearchBar from '../components/SearchBar';
import SegmentTabs from '../components/SegmentTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { DEFAULT_TABLE, MOBILE_TABLES, mobileTableByRoute } from '../constants';
import { mobileApi, MobilePost } from '../api';
import DesignIcon from '../components/DesignIcon';
import { mastergoAssets } from '../assets/mastergo';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';

const HomeSurface = styled.div`
  background: ${mobilePalette.bg};
`;

const Hero = styled.section`
  position: relative;
  min-height: 292px;
  overflow: hidden;
  padding: calc(24px + env(safe-area-inset-top)) 16px 0;
  background: linear-gradient(180deg, #fff9ed 0%, #ffffff 72%);
  &::before {
    content: '';
    position: absolute;
    left: -24px;
    right: -24px;
    top: -88px;
    height: 190px;
    background: radial-gradient(
        circle at 18% 60%,
        rgba(255, 198, 65, 0.34),
        transparent 35%
      ),
      radial-gradient(circle at 82% 36%, rgba(254, 152, 0, 0.18), transparent 32%);
  }
`;

const SearchWrap = styled.div`
  position: relative;
  z-index: 3;
  margin: 0;
`;

const HomeTitle = styled.div`
  position: relative;
  z-index: 2;
  margin: 0 0 18px;
  h1 {
    margin: 0 0 6px;
    color: ${mobilePalette.ink};
    font-size: 28px;
    font-weight: 900;
    line-height: 1.12;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    font-size: 13px;
  }
`;

const SearchPageHeader = styled.section`
  position: relative;
  padding: calc(18px + env(safe-area-inset-top)) 16px 16px;
  background: linear-gradient(180deg, #fff9ed, #fff);
`;

const TableGrid = styled.section`
  position: relative;
  z-index: 2;
  padding: 20px 0 16px;
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
  min-height: 104px;
  padding: 10px 6px 8px;
  text-align: center;
  background: rgba(255, 255, 255, 0.76);
  border: 0;
  border-radius: ${mobileRadius.lg};
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.98);
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.05);
  }
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
  padding: 14px 0 20px;
  background: ${mobilePalette.bg};
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
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid ${mobilePalette.lineSoft};
  backdrop-filter: blur(16px);
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
  left: 50%;
  bottom: calc(86px + env(safe-area-inset-bottom));
  z-index: 35;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  margin-left: min(176px, calc(50vw - 70px));
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
  width: calc(100% - 40px);
  height: 44px;
  margin: 4px 20px 28px;
  border-radius: ${mobileRadius.pill};
  background: #fff;
  border: 1px solid ${mobilePalette.lineSoft};
  color: #3d3d3d;
`;

const FeedIntro = styled.div`
  padding: 16px 20px 2px;
  color: ${mobilePalette.ink};
  font-size: 18px;
  font-weight: 900;
  background: ${mobilePalette.bg};
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
  const [error, setError] = useState('');
  const [activeTag, setActiveTag] = useState('全部');
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest');

  const fetchPosts = async (nextPage = 0, append = false) => {
    setLoading(true);
    setError('');
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
        setError(res.message || '加载失败');
        if (append) message.error(res.message || '加载失败');
        return;
      }
      const next = res.data.posts || [];
      setPosts((current) => (append ? [...current, ...next] : next));
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
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
              <HomeTitle>
                <h1>木犀茶馆</h1>
                <p>校园里的新鲜事，慢慢喝一口再说。</p>
              </HomeTitle>
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
          {!table && !isSearch ? <FeedIntro>正在聊</FeedIntro> : null}
          <PostList>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </PostList>
          <MoreButton disabled={loading} onClick={() => fetchPosts(page + 1, true)}>
            {loading ? '加载中...' : '加载更多'}
          </MoreButton>
        </>
      ) : error ? (
        <ErrorState text={error} onRetry={() => fetchPosts(0, false)} />
      ) : loading || !loaded ? (
        <LoadingState text="正在沏茶..." />
      ) : (
        <EmptyState
          title={query ? '没有找到相关帖子' : '还没有帖子'}
          text={
            query ? '换个关键词再试试，或回到首页看看新的茶桌。' : '成为第一个开聊的人。'
          }
          actionText={query ? '回到首页' : '发布帖子'}
          onAction={() => nav(query ? '/' : `/editor/article${Date.now()}`)}
        />
      )}
      <FloatingEdit type="button" onClick={() => nav(`/editor/article${Date.now()}`)}>
        <img src={mastergoAssets.icons.addSmall} alt="" />
      </FloatingEdit>
    </MobileShell>
  );
};

export default Home;
