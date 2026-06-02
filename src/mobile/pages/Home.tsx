import React, { useEffect, useRef, useState } from 'react';
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
import PullToRefresh from '../components/PullToRefresh';
import BackToTopButton from '../components/BackToTopButton';
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
  min-height: 304px;
  overflow: hidden;
  padding: calc(22px + env(safe-area-inset-top)) 20px 0;
  background: linear-gradient(180deg, #fffaf0 0%, #f8f9fc 100%);
  &::before {
    content: none;
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
  margin: 0 0 16px;
  h1 {
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 30px;
    font-weight: 800;
    line-height: 1.12;
  }
`;

const SearchPageHeader = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: calc(18px + env(safe-area-inset-top)) 16px 16px;
  background: linear-gradient(180deg, #fff9ed, #fff);
`;

const HeaderBackButton = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.06);
  transition: transform ${mobileMotion.fast}, background ${mobileMotion.fast};
  &:active {
    transform: scale(0.95);
    background: #fff;
  }
`;

const TableGrid = styled.section`
  position: relative;
  z-index: 2;
  padding: 22px 0 18px;
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
  min-height: 98px;
  padding: 12px 5px 10px;
  text-align: center;
  background: rgba(255, 255, 255, 0.76);
  border: 0;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.06);
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.98);
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.05);
  }
  .table-avatar {
    position: relative;
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    margin: 0 auto;
    border-radius: 18px;
    color: #fff;
    font-size: 19px;
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
    font-weight: 800;
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
  padding: 14px 0 10px;
  background: ${mobilePalette.bg};
`;

const DetailHero = styled.section`
  position: relative;
  padding: 18px 18px 20px;
  background: linear-gradient(180deg, #fff4d8 0%, #ffffff 100%);
  border-bottom: 1px solid ${mobilePalette.lineSoft};
`;

const TableIntro = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  .cover {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    color: #fff;
    font-size: 22px;
    font-weight: 900;
    box-shadow: 0 10px 22px rgba(254, 152, 0, 0.16);
  }
  h2 {
    margin: 0 0 6px;
    font-size: 20px;
    line-height: 1.22;
    font-weight: 700;
    color: #1a202c;
  }
  .meta {
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
  display: inline-flex;
  gap: 4px;
  margin: 12px 16px 2px;
  padding: 4px;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.05);
`;

const TableTabsPanel = styled.div`
  margin: 0;
  padding: 4px 0 10px;
  background: rgba(255, 255, 255, 0.9);
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

const TableActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 10px;
  background: transparent;
`;

const InlinePublish = styled.button`
  height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 198, 65, 0.2);
  color: #c46c00;
  font-size: 13px;
  font-weight: 800;
`;

const SortButton = styled.button<{ active: boolean }>`
  height: 32px;
  min-width: 58px;
  padding: 0 14px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: ${(props) => (props.active ? '#fe9800' : '#9ca3af')};
  border: 0;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? 700 : 500)};
  box-shadow: ${(props) =>
    props.active ? '0 6px 16px rgba(254, 152, 0, 0.14)' : 'none'};
`;

const FloatingEdit = styled.button`
  position: fixed;
  left: 50%;
  bottom: calc(86px + env(safe-area-inset-bottom));
  z-index: 35;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  margin-left: min(176px, calc(50vw - 70px));
  border-radius: 50%;
  background: linear-gradient(135deg, #ffc641, #fe9800);
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
  grid-template-columns: 40px 1fr 40px;
  gap: 10px;
  align-items: center;
  padding: calc(12px + env(safe-area-inset-top)) 16px 14px;
  background: linear-gradient(180deg, #fff4d8 0%, #fffaf0 100%);
  .ghost {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.66);
    color: #fe9800;
  }
`;

const LoadMoreStatus = styled.div`
  min-height: 42px;
  padding: 6px 20px 26px;
  display: grid;
  place-items: center;
  color: ${mobilePalette.muted};
  font-size: 12px;
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

const PAGE_SIZE = 20;

type HomeListCacheState = {
  posts: MobilePost[];
  page: number;
  hasMore: boolean;
  loaded: boolean;
};

const homeListCache = new Map<string, HomeListCacheState>();
const getHomeCacheKey = (input: {
  pathname: string;
  query: string;
  category?: string;
  activeTag: string;
  sort: string;
}) =>
  [
    input.pathname,
    input.query || '',
    input.category || '',
    input.activeTag || '',
    input.sort || '',
  ].join('|');

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
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [activeTag, setActiveTag] = useState('全部');
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const cacheKey = getHomeCacheKey({
    pathname,
    query,
    category: table?.apiCategory,
    activeTag,
    sort,
  });

  const fetchPosts = async (nextPage = 0, append = false, requestKey = cacheKey) => {
    if (append && (loading || !hasMore)) return;
    setLoading(true);
    setError('');
    try {
      const res = await mobileApi.posts.list({
        domain: 'normal',
        limit: PAGE_SIZE,
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
      setPosts((current) => {
        const merged = append ? [...current, ...next] : next;
        homeListCache.set(requestKey, {
          posts: merged,
          page: nextPage,
          hasMore: next.length >= PAGE_SIZE,
          loaded: true,
        });
        return merged;
      });
      setPage(nextPage);
      setHasMore(next.length >= PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = homeListCache.get(cacheKey);
    if (cached) {
      setPosts(cached.posts);
      setPage(cached.page);
      setLoaded(cached.loaded);
      setHasMore(cached.hasMore);
      setLoading(false);
      return;
    }
    setPosts([]);
    setPage(0);
    setLoaded(false);
    setHasMore(true);
    fetchPosts(0, false, cacheKey);
  }, [cacheKey]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !posts.length || !hasMore || loading) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          fetchPosts(page + 1, true);
        }
      },
      { rootMargin: '220px 0px 220px 0px', threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [posts.length, hasMore, loading, page]);

  const refreshPosts = async () => {
    await fetchPosts(0, false, cacheKey);
  };

  const goBackFromSearch = () => {
    if (window.history.length > 1) nav(-1);
    else nav('/');
  };

  return (
    <MobileShell
      title={table ? activeTable.name : '木犀茶馆'}
      back={!!table}
      right={table ? undefined : 'notice'}
      onRight={table ? undefined : () => nav('/notice')}
      showTopBar={!!table}
    >
      <PullToRefresh disabled={loading} onRefresh={refreshPosts}>
        <HomeSurface>
          {!table && !isSearch ? (
            <>
              <Hero>
                <HomeTitle>
                  <h1>木犀茶馆</h1>
                </HomeTitle>
                <SearchWrap>
                  <SearchBar
                    defaultValue={query}
                    placeholder="搜索茶馆"
                    onSearch={(value) => nav(value ? `/search?query=${value}` : '/')}
                  />
                </SearchWrap>
                <TableGrid>
                  <h3>茶桌</h3>
                  <div className="grid">
                    {MOBILE_TABLES.map((item) => (
                      <TableButton key={item.key} onClick={() => nav(`/${item.route}`)}>
                        <span
                          className="table-avatar"
                          style={{ background: tableVisuals[item.key].gradient }}
                        >
                          {tableVisuals[item.key].glyph}
                        </span>
                        <h4>{item.name}</h4>
                        <p>{item.intro}</p>
                      </TableButton>
                    ))}
                  </div>
                </TableGrid>
              </Hero>
            </>
          ) : isSearch ? (
            <SearchPageHeader>
              <HeaderBackButton
                type="button"
                aria-label="返回"
                onClick={goBackFromSearch}
              >
                <img
                  src={mastergoAssets.icons.backButtonDark}
                  alt=""
                  style={{ width: 9, height: 16 }}
                />
              </HeaderBackButton>
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
                  <span
                    className="cover"
                    style={{ background: tableVisuals[activeTable.key].gradient }}
                  >
                    {tableVisuals[activeTable.key].glyph}
                  </span>
                  <div>
                    <h2>{activeTable.name}</h2>
                    <span className="meta">官方分区</span>
                  </div>
                </TableIntro>
                <TableDesc>{activeTable.intro}</TableDesc>
              </DetailHero>
              <TableTabsPanel>
                <SegmentTabs
                  value={activeTag}
                  items={activeTable.tags.map((tag) => ({ label: tag, value: tag }))}
                  onChange={(value) => setActiveTag(String(value))}
                />
                <TableActions>
                  <InlinePublish
                    type="button"
                    onClick={() =>
                      nav(`/editor/article${Date.now()}`, {
                        state: { category: activeTable.apiCategory },
                      })
                    }
                  >
                    <span aria-hidden>+</span>
                    发到这个茶桌
                  </InlinePublish>
                </TableActions>
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
            <LoadMoreStatus ref={loadMoreRef}>
              {loading ? '正在加载...' : hasMore ? '' : '已经到底了'}
            </LoadMoreStatus>
          </>
        ) : error ? (
          <ErrorState text={error} onRetry={() => fetchPosts(0, false)} />
        ) : loading || !loaded ? (
          <LoadingState text="正在沏茶..." />
        ) : (
          <EmptyState
            title={query ? '没有找到相关帖子' : '还没有帖子'}
            text={
              query
                ? '换个关键词再试试，或回到首页看看新的茶桌。'
                : '成为第一个开聊的人。'
            }
            actionText={query ? '回到首页' : '发布帖子'}
            onAction={() => nav(query ? '/' : `/editor/article${Date.now()}`)}
          />
        )}
      </PullToRefresh>
      {!isSearch ? (
        <FloatingEdit type="button" onClick={() => nav(`/editor/article${Date.now()}`)}>
          <img src={mastergoAssets.icons.addSmall} alt="" />
        </FloatingEdit>
      ) : null}
      <BackToTopButton offset={isSearch ? 118 : table ? 156 : 150} />
    </MobileShell>
  );
};

export default Home;
