import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileImage from '../components/MobileImage';
import DesignIcon from '../components/DesignIcon';
import PullToRefresh from '../components/PullToRefresh';
import { CardSurface, mobilePalette, mobileRadius } from '../styles';
import { mobileApi, MobilePost, SipScoreWithEntries } from '../api';
import {
  applyPostStatPatch,
  applyStoredPostStatPatches,
  applyStoredSipScorePatches,
  getMobilePostId,
  MOBILE_POST_COLLECTION_EVENT,
  MOBILE_POST_STAT_EVENT,
  MobilePostStatPatch,
  MOBILE_SIP_SCORE_COLLECTION_EVENT,
  MOBILE_SIP_SCORE_EVENT,
  orderPostsByLocalCollectionTime,
  removeUncollectedPosts,
  removeUncollectedSipScores,
  SipScorePatch,
} from '../postEvents';

const List = styled.div`
  display: grid;
  gap: 12px;
  padding: 2px 0 24px;
  background: ${mobilePalette.bg};
`;

const RankingCard = styled(CardSurface)`
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 12px;
  width: calc(100% - 28px);
  margin: 0 auto;
  padding: 12px;
  border: 0;
  border-radius: 22px;
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
`;

const Cover = styled.div`
  width: 68px;
  height: 68px;
  border-radius: ${mobileRadius.lg};
  overflow: hidden;
`;

const RankingInfo = styled.div`
  min-width: 0;
  h3 {
    margin: 0 0 6px;
    color: ${mobilePalette.ink};
    font-size: 16px;
    font-weight: 800;
    line-height: 1.35;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .meta {
    margin-top: 8px;
    color: ${mobilePalette.orange};
    font-size: 12px;
  }
`;

type CollectionTab = 'published' | 'post' | 'sipScore';

type CollectionCacheState = {
  posts: MobilePost[];
  rankings: SipScoreWithEntries[];
  error: string;
  privacyBlocked: boolean;
};

const collectionCache = new Map<string, CollectionCacheState>();

const normalizeTab = (value: string): CollectionTab =>
  value === 'published' || value === 'sipScore' ? value : 'post';

const collectionCacheKey = (userId: number, tab: CollectionTab) => `${userId}:${tab}`;

const normalizeCacheForTab = (
  cache: CollectionCacheState,
  tab: CollectionTab,
): CollectionCacheState => {
  if (tab === 'sipScore') {
    return {
      ...cache,
      posts: [],
      rankings: removeUncollectedSipScores(applyStoredSipScorePatches(cache.rankings)),
    };
  }
  const patchedPosts = applyStoredPostStatPatches(cache.posts);
  return {
    ...cache,
    posts:
      tab === 'post'
        ? orderPostsByLocalCollectionTime(removeUncollectedPosts(patchedPosts))
        : patchedPosts,
    rankings: [],
  };
};

const Collection: React.FC = () => {
  const { user_id } = useParams();
  const userId = Number(user_id);
  const nav = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = normalizeTab(searchParams.get('tab') || 'post');
  const shouldForceInitialLoad = Boolean((state as any)?.forceReload);
  const initialCacheRaw = userId
    ? collectionCache.get(collectionCacheKey(userId, initialTab))
    : undefined;
  const initialCache =
    !shouldForceInitialLoad && initialCacheRaw
      ? normalizeCacheForTab(initialCacheRaw, initialTab)
      : undefined;
  const [tab, setTab] = useState<CollectionTab>(initialTab);
  const [posts, setPosts] = useState<MobilePost[]>(initialCache?.posts || []);
  const [rankings, setRankings] = useState<SipScoreWithEntries[]>(
    initialCache?.rankings || [],
  );
  const [loading, setLoading] = useState(!initialCache);
  const [error, setError] = useState(initialCache?.error || '');
  const [privacyBlocked, setPrivacyBlocked] = useState(
    initialCache?.privacyBlocked || false,
  );
  const requestSeqRef = useRef(0);
  const tabRef = useRef(tab);
  const routeKeyRef = useRef(`${userId}:${tab}`);

  useEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  const applyCache = (cache: CollectionCacheState, targetTab = tab) => {
    const normalized = normalizeCacheForTab(cache, targetTab);
    const key = userId ? collectionCacheKey(userId, targetTab) : '';
    if (key) collectionCache.set(key, normalized);
    setPosts(normalized.posts);
    setRankings(normalized.rankings);
    setError(normalized.error);
    setPrivacyBlocked(normalized.privacyBlocked);
    setLoading(false);
  };

  const load = async (options?: { force?: boolean }) => {
    if (!userId) return;
    const requestSeq = ++requestSeqRef.current;
    const currentUserId = Number(localStorage.getItem('userId')) || 0;
    const key = collectionCacheKey(userId, tab);
    const cached = collectionCache.get(key);
    if (cached && !options?.force) {
      applyCache(cached, tab);
      return;
    }
    setLoading(!cached);
    if (!cached) {
      setError('');
      setPrivacyBlocked(false);
      setPosts([]);
      setRankings([]);
    }

    if (tab !== 'published' && currentUserId !== userId) {
      try {
        const profileRes = await mobileApi.user.profile(userId);
        if (
          profileRes.code === 0 &&
          profileRes.data.is_public_collection_and_like === false
        ) {
          const next = {
            posts: [],
            rankings: [],
            error: '对方打开了隐私权限哦',
            privacyBlocked: true,
          };
          if (requestSeq !== requestSeqRef.current) return;
          collectionCache.set(key, next);
          applyCache(next, tab);
          return;
        }
      } catch {
        // 继续尝试目标列表接口，让下方错误处理给出最终状态。
      }
    }

    const request =
      tab === 'published'
        ? mobileApi.posts.published(userId, { limit: 30, page: 0 })
        : tab === 'post'
        ? mobileApi.collection.list(userId, { limit: 30, page: 0 })
        : mobileApi.sipScore.collected(userId, { limit: 30, page: 0 });

    try {
      const res = await request;
      if (requestSeq !== requestSeqRef.current) return;
      if (res.code === 20103) {
        const next = {
          posts: [],
          rankings: [],
          error: '对方打开了隐私权限哦',
          privacyBlocked: true,
        };
        collectionCache.set(key, next);
        applyCache(next, tab);
        return;
      }
      if (res.code !== 0) {
        const msg =
          tab === 'published'
            ? res.message || '发布的帖子加载失败'
            : res.message || '收藏加载失败';
        message.error(msg);
        if (!cached) setError(msg);
        return;
      }
      if (tab === 'published' || tab === 'post') {
        const nextPosts = applyStoredPostStatPatches(
          (('posts' in res.data ? res.data.posts : []) || []).map((post) =>
            tab === 'post' ? { ...post, is_collection: true } : post,
          ),
        );
        const next = {
          posts:
            tab === 'post'
              ? orderPostsByLocalCollectionTime(removeUncollectedPosts(nextPosts))
              : nextPosts,
          rankings: [],
          error: '',
          privacyBlocked: false,
        };
        collectionCache.set(key, next);
        applyCache(next, tab);
      } else {
        const next = {
          posts: [],
          rankings: removeUncollectedSipScores(
            applyStoredSipScorePatches(
              (('sip_scores' in res.data ? res.data.sip_scores : []) || []).map(
                (item) => ({
                  ...item,
                  sip_score: {
                    ...(item.sip_score || {}),
                    is_collected: true,
                  },
                }),
              ),
            ),
          ),
          error: '',
          privacyBlocked: false,
        };
        collectionCache.set(key, next);
        applyCache(next, tab);
      }
    } catch (err) {
      if (requestSeq !== requestSeqRef.current) return;
      const fallback = tab === 'published' ? '发布的帖子加载失败' : '收藏加载失败';
      const msg = err instanceof Error ? err.message || fallback : fallback;
      if (cached) {
        message.error(msg);
      } else {
        setError(msg);
      }
    } finally {
      if (requestSeq === requestSeqRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const shouldForce = Boolean((state as any)?.forceReload);
    load({ force: shouldForce });
    if (shouldForce) {
      nav(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [tab, userId, (state as any)?.forceReload]);

  const changeTab = (value: string | number) => {
    const nextTab = normalizeTab(String(value));
    if (nextTab === tab) return;
    requestSeqRef.current += 1;
    tabRef.current = nextTab;
    routeKeyRef.current = `${userId}:${nextTab}`;
    const cached = userId
      ? collectionCache.get(collectionCacheKey(userId, nextTab))
      : undefined;
    if (cached) {
      applyCache(cached, nextTab);
    } else {
      setLoading(true);
      setError('');
      setPrivacyBlocked(false);
      setPosts([]);
      setRankings([]);
    }
    setTab(nextTab);
    setSearchParams({ tab: nextTab }, { replace: true });
  };

  useLayoutEffect(() => {
    const nextTab = normalizeTab(searchParams.get('tab') || 'post');
    const nextRouteKey = `${userId}:${nextTab}`;
    if (nextRouteKey === routeKeyRef.current) return;
    routeKeyRef.current = nextRouteKey;
    requestSeqRef.current += 1;
    tabRef.current = nextTab;
    const cached = userId
      ? collectionCache.get(collectionCacheKey(userId, nextTab))
      : undefined;
    if (cached) {
      applyCache(cached, nextTab);
    } else {
      setLoading(true);
      setError('');
      setPrivacyBlocked(false);
      setPosts([]);
      setRankings([]);
    }
    setTab(nextTab);
  }, [searchParams, userId]);

  useEffect(() => {
    const handlePostPatch = (event: Event) => {
      const patch = (event as CustomEvent<MobilePostStatPatch>).detail;
      if (!patch?.id) return;
      setPosts((current) =>
        tab === 'post' && (patch.is_collection === false || patch.removed_from_collection)
          ? current.filter((post) => getMobilePostId(post) !== Number(patch.id))
          : current.map((post) => applyPostStatPatch(post, patch)),
      );
      collectionCache.forEach((cache, key) => {
        if (!key.endsWith(':post') && !key.endsWith(':published')) return;
        cache.posts =
          key.endsWith(':post') &&
          (patch.is_collection === false || patch.removed_from_collection)
            ? cache.posts.filter((post) => getMobilePostId(post) !== Number(patch.id))
            : cache.posts.map((post) => applyPostStatPatch(post, patch));
      });
    };
    window.addEventListener(MOBILE_POST_STAT_EVENT, handlePostPatch);
    window.addEventListener(MOBILE_POST_COLLECTION_EVENT, handlePostPatch);
    return () => {
      window.removeEventListener(MOBILE_POST_STAT_EVENT, handlePostPatch);
      window.removeEventListener(MOBILE_POST_COLLECTION_EVENT, handlePostPatch);
    };
  }, [tab]);

  useEffect(() => {
    const handleSipScorePatch = (event: Event) => {
      const patch = (event as CustomEvent<SipScorePatch>).detail;
      if (!patch?.id) return;
      setRankings((current) =>
        tab === 'sipScore' &&
        (patch.is_collected === false || patch.removed_from_collection)
          ? current.filter((item) => Number(item.sip_score?.id) !== Number(patch.id))
          : applyStoredSipScorePatches(current),
      );
      collectionCache.forEach((cache, key) => {
        if (!key.endsWith(':sipScore')) return;
        cache.rankings =
          patch.is_collected === false || patch.removed_from_collection
            ? cache.rankings.filter(
                (item) => Number(item.sip_score?.id) !== Number(patch.id),
              )
            : applyStoredSipScorePatches(cache.rankings);
      });
    };
    window.addEventListener(MOBILE_SIP_SCORE_EVENT, handleSipScorePatch);
    window.addEventListener(MOBILE_SIP_SCORE_COLLECTION_EVENT, handleSipScorePatch);
    return () => {
      window.removeEventListener(MOBILE_SIP_SCORE_EVENT, handleSipScorePatch);
      window.removeEventListener(MOBILE_SIP_SCORE_COLLECTION_EVENT, handleSipScorePatch);
    };
  }, [tab]);

  return (
    <MobileShell title={tab === 'published' ? '发布的帖子' : '收藏'} back tabs={false}>
      <SegmentTabs
        value={tab}
        items={[
          { label: '发布', value: 'published' },
          { label: '收藏帖子', value: 'post' },
          { label: '收藏榜单', value: 'sipScore' },
        ]}
        onChange={changeTab}
      />
      <PullToRefresh
        disabled={loading}
        indicatorTop="calc(112px + env(safe-area-inset-top))"
        onRefresh={() => load({ force: true })}
      >
        {loading ? (
          <LoadingState
            text={tab === 'published' ? '正在读取发布的帖子...' : '正在读取收藏...'}
          />
        ) : error ? (
          privacyBlocked ? (
            <EmptyState title="对方打开了隐私权限哦" text="公开收藏后才能查看这里。" />
          ) : (
            <ErrorState text={error} onRetry={() => load({ force: true })} />
          )
        ) : tab === 'published' || tab === 'post' ? (
          posts.length ? (
            <List>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </List>
          ) : (
            <EmptyState
              title={tab === 'published' ? '还没有发过帖子' : '还没有收藏帖子'}
            />
          )
        ) : rankings.length ? (
          <List>
            {rankings.map((item) => {
              const ranking = item.sip_score;
              return (
                <RankingCard
                  key={ranking?.id}
                  onClick={() => ranking?.id && nav(`/sip-score/${ranking.id}`)}
                >
                  <Cover>
                    <MobileImage
                      src={ranking?.cover_img}
                      fallbackText="榜单"
                      radius={8}
                    />
                  </Cover>
                  <RankingInfo>
                    <h3>{ranking?.name || '未命名榜单'}</h3>
                    <p>{ranking?.description || '暂无简介'}</p>
                    <div className="meta">
                      <DesignIcon
                        name="bookmark"
                        size={13}
                        color={mobilePalette.orange}
                      />{' '}
                      {ranking?.collect_count || 0} 收藏 ·{' '}
                      {ranking?.entry_count || item.entries?.length || 0} 个对象
                    </div>
                  </RankingInfo>
                </RankingCard>
              );
            })}
          </List>
        ) : (
          <EmptyState title="还没有收藏榜单" text="遇到好榜单，可以先收藏起来。" />
        )}
      </PullToRefresh>
    </MobileShell>
  );
};

export default Collection;
