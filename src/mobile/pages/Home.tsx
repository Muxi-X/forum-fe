import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import SearchBar from '../components/SearchBar';
import SegmentTabs from '../components/SegmentTabs';
import PostCard from '../components/PostCard';
import TeaCupHeroSvg from '../components/TeaCupHeroSvg';
import EmptyState from '../components/EmptyState';
import { mobilePalette, PrimaryButton } from '../styles';
import {
  DEFAULT_TABLE,
  MOBILE_TABLES,
  mobileTableByRoute,
  SORT_TYPE,
} from '../constants';
import { mobileApi, MobilePost } from '../api';

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: 16px 16px 20px;
  background: radial-gradient(
      circle at 22% 28%,
      rgba(255, 255, 255, 0.6) 0 8px,
      transparent 9px
    ),
    linear-gradient(135deg, #ffe8a8 0%, #ffd271 48%, #fff9e7 100%);
`;

const HeroText = styled.div`
  position: relative;
  z-index: 1;
  width: 58%;
  h2 {
    margin: 10px 0 8px;
    font-size: 24px;
    line-height: 1.2;
    font-weight: 900;
    color: #273042;
  }
  p {
    margin: 0;
    color: #6d7480;
    line-height: 1.55;
  }
`;

const Cup = styled(TeaCupHeroSvg)`
  position: absolute;
  right: -2px;
  bottom: 12px;
  width: 44%;
  max-width: 180px;
`;

const SearchWrap = styled.div`
  padding: 14px 16px 0;
  background: ${mobilePalette.paper};
`;

const TableGrid = styled.section`
  padding: 16px;
  background: ${mobilePalette.paper};
  h3 {
    margin: 0 0 12px;
    font-size: 16px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;

const TableButton = styled.button`
  min-height: 76px;
  border-radius: 8px;
  padding: 12px;
  text-align: left;
  background: #fff;
  border: 1px solid ${mobilePalette.line};
  h4 {
    margin: 0 0 7px;
    font-size: 15px;
    color: ${mobilePalette.ink};
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.45;
    font-size: 12px;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 8px;
  h3 {
    margin: 0;
    font-size: 16px;
  }
`;

const PostList = styled.div`
  display: grid;
  gap: 10px;
  padding: 0 12px 20px;
`;

const DetailHero = styled.section`
  padding: 18px 16px;
  background: linear-gradient(135deg, #fff5d5, #fffefa 70%);
  border-bottom: 1px solid ${mobilePalette.line};
  h2 {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 900;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.55;
  }
`;

const SortRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: ${mobilePalette.paper};
`;

const SortButton = styled.button<{ active: boolean }>`
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${(props) => (props.active ? '#253042' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : mobilePalette.muted)};
  border: 1px solid ${(props) => (props.active ? '#253042' : mobilePalette.line)};
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
  background: ${mobilePalette.orange};
  color: #fff;
  font-size: 21px;
  box-shadow: 0 12px 28px rgba(255, 159, 26, 0.32);
`;

const MoreButton = styled.button`
  height: 42px;
  margin: 4px 16px 24px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid ${mobilePalette.line};
  color: ${mobilePalette.ink};
`;

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
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState('全部');
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest');

  const listTitle = useMemo(() => {
    if (isSearch) return query ? `"${query}" 的搜索结果` : '搜索茶馆';
    if (table) return '茶桌帖子';
    return '最新帖子';
  }, [isSearch, query, table]);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(0);
    fetchPosts(0, false);
  }, [query, params.category, activeTag, sort]);

  return (
    <MobileShell
      title={table ? activeTable.name : '木犀茶馆'}
      right="notice"
      onRight={() => nav('/notice')}
    >
      {!table ? (
        <>
          <Hero>
            <HeroText>
              <span>WELCOME</span>
              <h2>今天也来茶馆坐坐</h2>
              <p>看见校园里的真实经验、情绪和一点点灵光。</p>
            </HeroText>
            <Cup />
          </Hero>
          <SearchWrap>
            <SearchBar
              defaultValue={query}
              placeholder="搜索帖子、茶桌或关键词"
              onSearch={(value) => nav(value ? `/search?query=${value}` : '/')}
            />
          </SearchWrap>
          <TableGrid>
            <h3>茶桌分类</h3>
            <div className="grid">
              {MOBILE_TABLES.map((item) => (
                <TableButton key={item.key} onClick={() => nav(`/${item.route}`)}>
                  <h4>
                    {item.name} <RightOutlined />
                  </h4>
                  <p>{item.intro}</p>
                </TableButton>
              ))}
            </div>
          </TableGrid>
        </>
      ) : (
        <>
          <DetailHero>
            <h2>{activeTable.name}</h2>
            <p>{activeTable.intro}</p>
          </DetailHero>
          <SegmentTabs
            value={activeTag}
            items={activeTable.tags.map((tag) => ({ label: tag, value: tag }))}
            onChange={(value) => setActiveTag(String(value))}
          />
        </>
      )}

      <SortRow>
        <SortButton active={sort === 'newest'} onClick={() => setSort('newest')}>
          最新
        </SortButton>
        <SortButton active={sort === 'hottest'} onClick={() => setSort('hottest')}>
          热门
        </SortButton>
      </SortRow>
      <ListHeader>
        <h3>{listTitle}</h3>
        {!table ? (
          <PrimaryButton onClick={() => nav(`/${DEFAULT_TABLE.route}`)}>
            去茶桌
          </PrimaryButton>
        ) : null}
      </ListHeader>
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
      ) : (
        <EmptyState text={loading ? '加载中...' : '还没有帖子'} />
      )}
      <FloatingEdit type="button" onClick={() => nav(`/editor/article${Date.now()}`)}>
        <EditOutlined />
      </FloatingEdit>
    </MobileShell>
  );
};

export default Home;
