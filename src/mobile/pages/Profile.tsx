import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  useLocation,
  useNavigate,
  useParams,
  createSearchParams,
} from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileToast from '../components/MobileToast';
import MobileAvatar from '../components/MobileAvatar';
import PullToRefresh from '../components/PullToRefresh';
import BackToTopButton from '../components/BackToTopButton';
import DesignIcon from '../components/DesignIcon';
import { mobileMotion, mobilePalette, mobileRadius, Section } from '../styles';
import { mobileApi, MobilePost, MobileUser, SipScoreWithEntries } from '../api';
import {
  notificationPollIntervalMs,
  refreshNotificationStore,
} from '../notificationSync';
import {
  emitMobileFollowPatch,
  getFollowRevision,
  MOBILE_FOLLOW_EVENT,
  MobileFollowPatch,
} from '../followEvents';
import { mastergoAssets } from '../assets/mastergo';
import { clearAuthStorage } from '../../utils/auth';
import useNotification from 'store/useNotification';
import {
  createMobileProfileSessionState,
  emitMobileProfileRefresh,
  getMobileProfileRefreshRevision,
  hasActiveMobileProfileSession,
  MOBILE_PROFILE_REFRESH_EVENT,
  MobileProfileRefreshPatch,
  MobileProfileRouteState,
} from '../profileSession';
import {
  applyPostStatPatch,
  applyStoredPostStatPatches,
  applyStoredSipScorePatches,
  getMobilePostId,
  getPostRevision,
  getSipScoreRevision,
  MOBILE_POST_COLLECTION_EVENT,
  MOBILE_POST_CREATED_EVENT,
  MOBILE_POST_STAT_EVENT,
  MOBILE_SIP_SCORE_COLLECTION_EVENT,
  MOBILE_SIP_SCORE_EVENT,
  MobilePostStatPatch,
  orderPostsByLocalCollectionTime,
  removeUncollectedPosts,
  removeUncollectedSipScores,
  SipScorePatch,
} from '../postEvents';

type ProfileCacheState = {
  profile: MobileUser;
  posts: MobilePost[];
  collectedPosts: MobilePost[];
  collectedRankings: SipScoreWithEntries[];
  currentUserId: number;
  followRevision: number;
  postRevision: number;
  sipScoreRevision: number;
  profileRefreshRevision: number;
};

const profileCache = new Map<number, ProfileCacheState>();

export const clearMobileProfileCache = (profileId?: number) => {
  if (profileId) {
    profileCache.delete(profileId);
    return;
  }
  profileCache.clear();
};

const profileRefreshListenerKey = '__forumMobileProfileRefreshListener';

if (
  typeof window !== 'undefined' &&
  !(window as typeof window & Record<string, boolean>)[profileRefreshListenerKey]
) {
  (window as typeof window & Record<string, boolean>)[profileRefreshListenerKey] = true;
  window.addEventListener(MOBILE_PROFILE_REFRESH_EVENT, (event) => {
    const patch = (event as CustomEvent<MobileProfileRefreshPatch>).detail;
    clearMobileProfileCache(patch?.userId);
  });
}

export const applyMobileProfileFollowPatch = (patch: MobileFollowPatch) => {
  if (!patch?.targetUserId) return;
  profileCache.forEach((cache) => {
    if (cache.profile.id === patch.targetUserId) {
      cache.profile = {
        ...cache.profile,
        is_following: patch.is_following,
        follower_count: patch.follower_count ?? cache.profile.follower_count,
      };
    }
    if (cache.profile.id === patch.currentUserId) {
      cache.profile = {
        ...cache.profile,
        following_count: patch.following_count ?? cache.profile.following_count,
      };
    }
    cache.followRevision = getFollowRevision();
  });
};

const Hero = styled.section`
  position: relative;
  min-height: 318px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 54%, #f7f8fb 100%),
    linear-gradient(135deg, #fff8e6 0%, #ffd879 52%, #fff2cc 100%);
  &::before {
    content: '';
    position: absolute;
    right: 18px;
    top: 68px;
    width: 144px;
    height: 118px;
    background: url(${mastergoAssets.decorations.teaCupLarge}) center / contain no-repeat;
    opacity: 0.18;
    transform: rotate(-3deg);
  }
  &::after {
    content: '';
    position: absolute;
    left: -20px;
    right: -20px;
    bottom: -18px;
    height: 92px;
    background: linear-gradient(180deg, rgba(247, 248, 251, 0), #f7f8fb 74%);
  }
`;

const HeroActions = styled.div`
  position: absolute;
  right: 18px;
  top: calc(18px + env(safe-area-inset-top));
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const HeroBackButton = styled.button`
  position: absolute;
  left: 18px;
  top: calc(18px + env(safe-area-inset-top));
  z-index: 4;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 26px rgba(16, 24, 40, 0.08);
  backdrop-filter: blur(14px);
  transition: transform ${mobileMotion.fast};
  img {
    width: 9px;
    height: 17px;
  }
  &:active {
    transform: scale(0.96);
  }
`;

const TitleIconButton = styled.button`
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 10px 26px rgba(16, 24, 40, 0.08);
  backdrop-filter: blur(14px);
  transition: transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
  }
  .anticon {
    color: ${mobilePalette.inkSoft};
  }
  .dot {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${mobilePalette.danger};
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
  }
`;

const ProfilePanel = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 12px;
  z-index: 2;
  min-height: 206px;
  padding: 64px 18px 16px;
  isolation: isolate;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.72);
    box-shadow: 0 18px 42px rgba(16, 24, 40, 0.1);
    backdrop-filter: blur(18px);
  }
`;

const Avatar = styled(MobileAvatar)`
  position: absolute;
  left: 20px;
  top: -46px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0;
  h1 {
    margin: 0;
    max-width: min(250px, calc(100vw - 128px));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 24px;
    line-height: 1.1;
    font-weight: 800;
    color: #1a202c;
  }
  .anticon {
    color: #7f838a;
    font-size: 16px;
  }
  button {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: transparent;
    transition: background ${mobileMotion.fast}, transform ${mobileMotion.fast};
    img {
      width: 15px;
      height: 15px;
    }
    &:active {
      background: rgba(60, 60, 67, 0.08);
      transform: scale(0.94);
    }
  }
`;

const Signature = styled.p`
  margin: 10px 0 18px;
  max-width: min(310px, calc(100vw - 64px));
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #7f838a;
  font-size: 14px;
`;

const Counts = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 68px);
  gap: 14px;
  color: #7f838a;
  font-size: 12px;
  text-align: center;
  strong {
    display: block;
    margin-bottom: 5px;
    color: #3d3d3d;
    font-size: 18px;
    font-weight: 800;
  }
  span {
    min-height: 48px;
    display: grid;
    align-content: center;
    justify-items: center;
    border-radius: 15px;
    background: rgba(247, 248, 251, 0.9);
  }
  button {
    min-height: 48px;
    display: grid;
    align-content: center;
    justify-items: center;
    border-radius: 15px;
    background: rgba(247, 248, 251, 0.9);
    color: inherit;
    transition: transform ${mobileMotion.fast}, background ${mobileMotion.fast};
    &:active {
      transform: scale(0.96);
      background: #fff;
    }
  }
`;

const ActionBar = styled.div`
  position: absolute;
  right: 24px;
  top: 58px;
  display: flex;
  gap: 8px;
`;

const VisitorButton = styled.button<{ primary?: boolean }>`
  height: 32px;
  min-width: 64px;
  padding: 0 13px;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.primary ? '#fe9800' : '#ffc641')};
  background: ${(props) => (props.primary ? '#fe9800' : '#fff')};
  color: ${(props) => (props.primary ? '#fff' : '#fe9800')};
  font-size: 13px;
  font-weight: 800;
`;

const Menu = styled(Section)`
  margin-top: 0;
  padding: 0 14px 8px;
  background: ${mobilePalette.bg};
  border-top: 0;
  border-bottom: 0;
`;

const MenuItem = styled.button`
  width: 100%;
  min-height: 58px;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 32px;
  align-items: center;
  margin: 0 0 8px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.045);
  border-bottom: 0;
  text-align: left;
  color: #3d3d3d;
  font-size: 16px;
  transition: transform ${mobileMotion.fast}, background ${mobileMotion.fast};
  .chevron {
    justify-self: end;
  }
  &:active {
    transform: scale(0.985);
    background: #fff;
  }
  &:last-child {
    border-bottom: 0;
  }
`;

const ExpandedPanel = styled.div`
  position: relative;
  margin: -2px 0 6px;
  padding-left: 44px;
  background: transparent;
  border-bottom: 0;
  &::before {
    content: '';
    position: absolute;
    left: 25px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    border-radius: 999px;
    background: rgba(255, 198, 65, 0.34);
  }
`;

const ExpandedPosts = styled.div`
  min-height: 0;
  padding: 0 0 2px;
`;

const ViewAll = styled.button`
  display: block;
  margin: 10px auto 12px;
  background: transparent;
  color: #ffc641;
  font-size: 13px;
  font-weight: 500;
`;

const MiniEmpty = styled.div`
  min-height: 52px;
  display: grid;
  place-items: center;
  color: #a0a5ad;
  font-size: 13px;
`;

const CollectionGroupButton = styled.button`
  width: 100%;
  min-height: 44px;
  display: grid;
  grid-template-columns: 1fr 22px;
  align-items: center;
  margin: 6px 0;
  padding: 0 14px;
  text-align: left;
  border-radius: ${mobileRadius.md};
  background: rgba(255, 255, 255, 0.78);
  color: #7f838a;
  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.045);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  &:active {
    transform: scale(0.99);
    box-shadow: 0 5px 14px rgba(16, 24, 40, 0.05);
  }
  & + & {
    margin-top: 8px;
  }
`;

const ViewAllButton = styled(CollectionGroupButton)`
  min-height: 44px;
  color: #b06400;
  font-weight: 800;
  background: rgba(255, 198, 65, 0.14);
`;

const RankingCard = styled.button`
  width: calc(100% - 40px);
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 10px;
  align-items: center;
  margin: 8px 20px 0;
  padding: 10px;
  background: ${mobilePalette.paper};
  border: 1px solid rgba(60, 60, 67, 0.1);
  border-radius: ${mobileRadius.md};
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05);
  text-align: left;
  .cover {
    width: 52px;
    height: 52px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ffe8a8, #8bc6a4);
    background-size: cover;
    background-position: center;
  }
  h3 {
    margin: 0 0 4px;
    color: ${mobilePalette.ink};
    font-size: 14px;
    line-height: 1.35;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    font-size: 12px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const ActionGroup = styled.div`
  margin-top: 8px;
`;

const profileListPath = (profileId: number | string, tab: string) =>
  `/user/${profileId}/collect?${createSearchParams({ tab }).toString()}`;

const Profile: React.FC = () => {
  const { user_id } = useParams();
  const { state } = useLocation();
  const routeState = state as MobileProfileRouteState | null;
  const userId = Number(user_id);
  const nav = useNavigate();
  const myId = Number(localStorage.getItem('userId')) || 0;
  const { totalUnreadCount } = useNotification();
  const initialTargetId = userId || myId;
  const isInitialMine = Boolean(!userId || (myId && userId === myId));
  const hasInitialProfileSession = hasActiveMobileProfileSession(
    routeState,
    initialTargetId,
  );
  const canUseInitialCache =
    !routeState?.refreshProfile && (isInitialMine || hasInitialProfileSession);
  const initialCacheCandidate = initialTargetId
    ? profileCache.get(initialTargetId)
    : undefined;
  const initialCache =
    canUseInitialCache &&
    initialCacheCandidate &&
    initialCacheCandidate.postRevision === getPostRevision() &&
    initialCacheCandidate.sipScoreRevision === getSipScoreRevision() &&
    initialCacheCandidate.profileRefreshRevision ===
      getMobileProfileRefreshRevision(initialTargetId)
      ? initialCacheCandidate
      : undefined;
  const [currentUserId, setCurrentUserId] = useState(initialCache?.currentUserId || myId);
  const [profile, setProfile] = useState<MobileUser | null>(
    initialCache?.profile || null,
  );
  const [posts, setPosts] = useState<MobilePost[]>(initialCache?.posts || []);
  const [collectedPosts, setCollectedPosts] = useState<MobilePost[]>(
    initialCache?.collectedPosts || [],
  );
  const [collectedRankings, setCollectedRankings] = useState<SipScoreWithEntries[]>(
    initialCache?.collectedRankings || [],
  );
  const [expanded, setExpanded] = useState<Record<'posts' | 'collections', boolean>>({
    posts: false,
    collections: false,
  });
  const [collectionExpanded, setCollectionExpanded] = useState({
    posts: false,
    rankings: false,
  });
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState(!initialCache);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileHasUnread, setProfileHasUnread] = useState(false);
  const visibleStateTargetRef = useRef<number | undefined>(undefined);
  const mountedRef = useRef(true);
  const loadVersionRef = useRef(0);
  const isMine = Boolean(
    !userId ||
      (currentUserId && userId === currentUserId) ||
      (profile?.id && currentUserId && profile.id === currentUserId),
  );
  const canViewCollection = isMine || profile?.is_public_collection_and_like !== false;

  const isProfileSessionFor = (targetId?: number) =>
    hasActiveMobileProfileSession(routeState, targetId);

  const shouldUseProfileCache = (isTargetMine: boolean, targetId?: number) =>
    !routeState?.refreshProfile && (isTargetMine || isProfileSessionFor(targetId));

  const internalListState = () =>
    isMine
      ? null
      : isProfileSessionFor(profile?.id || userId)
      ? routeState
      : createMobileProfileSessionState(Number(profile?.id || userId));

  const resetVisibleStateForRoute = (options?: { resetPanels?: boolean }) => {
    const nextTarget = userId || currentUserId;
    const nextIsMine = Boolean(!userId || (currentUserId && userId === currentUserId));
    const cacheCandidate = nextTarget ? profileCache.get(nextTarget) : undefined;
    const cached =
      shouldUseProfileCache(nextIsMine, nextTarget) &&
      cacheCandidate &&
      cacheCandidate.postRevision === getPostRevision() &&
      cacheCandidate.sipScoreRevision === getSipScoreRevision() &&
      cacheCandidate.profileRefreshRevision ===
        getMobileProfileRefreshRevision(nextTarget)
        ? cacheCandidate
        : undefined;
    if (cached) {
      setProfile(cached.profile);
      setPosts(cached.posts);
      setCollectedPosts(cached.collectedPosts);
      setCollectedRankings(cached.collectedRankings);
      setCurrentUserId(cached.currentUserId);
      setLoading(false);
    } else {
      setProfile(null);
      setPosts([]);
      setCollectedPosts([]);
      setCollectedRankings([]);
      setLoading(true);
    }
    if (options?.resetPanels !== false) {
      setExpanded({ posts: false, collections: false });
      setCollectionExpanded({ posts: false, rankings: false });
    }
    setError('');
    setSectionsLoading(false);
  };

  const load = async (options?: { force?: boolean }) => {
    const loadVersion = ++loadVersionRef.current;
    const isCurrentLoad = () =>
      mountedRef.current && loadVersionRef.current === loadVersion;
    const targetBeforeResolve = userId || currentUserId;
    const targetIsMine = Boolean(!userId || (currentUserId && userId === currentUserId));
    const cached =
      shouldUseProfileCache(targetIsMine, targetBeforeResolve) &&
      !options?.force &&
      targetBeforeResolve
        ? profileCache.get(targetBeforeResolve)
        : undefined;
    if (
      cached &&
      cached.postRevision === getPostRevision() &&
      cached.sipScoreRevision === getSipScoreRevision() &&
      cached.profileRefreshRevision ===
        getMobileProfileRefreshRevision(targetBeforeResolve)
    ) {
      setProfile(cached.profile);
      const cachedPosts = applyStoredPostStatPatches(cached.posts);
      const cachedCollectedPosts = orderPostsByLocalCollectionTime(
        removeUncollectedPosts(applyStoredPostStatPatches(cached.collectedPosts)),
      );
      const cachedCollectedRankings = removeUncollectedSipScores(
        applyStoredSipScorePatches(cached.collectedRankings),
      );
      cached.posts = cachedPosts;
      cached.collectedPosts = cachedCollectedPosts;
      cached.collectedRankings = cachedCollectedRankings;
      setPosts(cachedPosts);
      setCollectedPosts(cachedCollectedPosts);
      setCollectedRankings(cachedCollectedRankings);
      setCurrentUserId(cached.currentUserId);
      setSectionsLoading(false);
      setLoading(false);
      return;
    } else {
      setLoading(true);
    }
    setError('');
    let resolvedCurrentUserId = currentUserId;
    if (!resolvedCurrentUserId) {
      try {
        const myProfileRes = await mobileApi.user.myProfile();
        if (!isCurrentLoad()) return;
        if (myProfileRes.code === 0 && myProfileRes.data.id) {
          resolvedCurrentUserId = myProfileRes.data.id;
          setCurrentUserId(resolvedCurrentUserId);
          localStorage.setItem('userId', String(resolvedCurrentUserId));
        }
      } catch {
        // keep anonymous fallback in local development
      }
    }
    const target = userId || resolvedCurrentUserId;
    const fallbackProfile = (id?: number): MobileUser => ({
      id: id || 0,
      name: '茶友',
      avatar: '',
      signature: '',
      following_count: 0,
      follower_count: 0,
      is_following: false,
    });

    let nextProfile: MobileUser | null = null;
    try {
      const profileRes = target
        ? await mobileApi.user.profile(target)
        : await mobileApi.user.myProfile();
      if (!isCurrentLoad()) return;
      if (profileRes.code === 0) nextProfile = profileRes.data;
      else setError(profileRes.message || '资料加载失败');
    } catch (error) {
      if (import.meta.env.DEV) {
        try {
          const myProfileRes = await mobileApi.user.myProfile();
          if (!isCurrentLoad()) return;
          if (myProfileRes.code === 0) nextProfile = myProfileRes.data;
        } catch {
          nextProfile = fallbackProfile(target);
        }
      }
    }

    const effectiveProfile = nextProfile || fallbackProfile(target);
    const effectiveId = effectiveProfile.id || target;
    if (!isCurrentLoad()) return;
    setProfile(effectiveProfile);

    if (!effectiveId) {
      setSectionsLoading(false);
      setLoading(false);
      return;
    }
    setSectionsLoading(true);
    const [postsRes, collectedPostsRes, collectedRankingsRes] = await Promise.allSettled([
      mobileApi.posts.published(effectiveId, { limit: 10 }),
      mobileApi.collection.list(effectiveId, { limit: 3, page: 0 }),
      mobileApi.sipScore.collected(effectiveId, { limit: 3, page: 0 }),
    ]);
    if (!isCurrentLoad()) return;
    const nextPosts =
      postsRes.status === 'fulfilled' && postsRes.value.code === 0
        ? applyStoredPostStatPatches(postsRes.value.data.posts || [])
        : [];
    const nextCollectedPosts =
      collectedPostsRes.status === 'fulfilled' && collectedPostsRes.value.code === 0
        ? orderPostsByLocalCollectionTime(
            removeUncollectedPosts(
              applyStoredPostStatPatches(
                (collectedPostsRes.value.data.posts || []).map((post) => ({
                  ...post,
                  is_collection: true,
                })),
              ),
            ),
          )
        : [];
    const nextCollectedRankings =
      collectedRankingsRes.status === 'fulfilled' && collectedRankingsRes.value.code === 0
        ? removeUncollectedSipScores(
            applyStoredSipScorePatches(
              (collectedRankingsRes.value.data.sip_scores || []).map((item) => ({
                ...item,
                sip_score: {
                  ...(item.sip_score || {}),
                  is_collected: true,
                },
              })),
            ),
          )
        : [];

    if (postsRes.status === 'fulfilled' && postsRes.value.code === 0) {
      setPosts(nextPosts);
    } else {
      setPosts([]);
    }
    if (collectedPostsRes.status === 'fulfilled' && collectedPostsRes.value.code === 0) {
      setCollectedPosts(nextCollectedPosts);
    } else {
      setCollectedPosts([]);
    }
    if (
      collectedRankingsRes.status === 'fulfilled' &&
      collectedRankingsRes.value.code === 0
    ) {
      setCollectedRankings(nextCollectedRankings);
    } else {
      setCollectedRankings([]);
    }
    const effectiveIsMine = Boolean(
      !userId || (resolvedCurrentUserId && Number(effectiveId) === resolvedCurrentUserId),
    );
    const shouldStartProfileSession = Boolean(
      Number(effectiveId) &&
        !effectiveIsMine &&
        !isProfileSessionFor(Number(effectiveId)),
    );
    if (shouldStartProfileSession) {
      emitMobileProfileRefresh(Number(effectiveId));
    }
    profileCache.set(Number(effectiveId), {
      profile: effectiveProfile,
      posts: nextPosts,
      collectedPosts: nextCollectedPosts,
      collectedRankings: nextCollectedRankings,
      currentUserId: resolvedCurrentUserId,
      followRevision: getFollowRevision(),
      postRevision: getPostRevision(),
      sipScoreRevision: getSipScoreRevision(),
      profileRefreshRevision: getMobileProfileRefreshRevision(effectiveId),
    });
    if (shouldStartProfileSession) {
      nav(`/user/${effectiveId}`, {
        replace: true,
        state: createMobileProfileSessionState(Number(effectiveId)),
      });
    }
    setSectionsLoading(false);
    setLoading(false);
  };

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      loadVersionRef.current += 1;
    };
  }, []);

  useLayoutEffect(() => {
    const nextTarget = userId || currentUserId;
    const shouldResetPanels = visibleStateTargetRef.current !== nextTarget;
    visibleStateTargetRef.current = nextTarget;
    resetVisibleStateForRoute({ resetPanels: shouldResetPanels });
    if (routeState?.refreshProfile) {
      refreshProfile();
      nav(`/user/${userId || currentUserId || ''}`, { replace: true, state: null });
      return;
    }
    load();
  }, [userId, routeState?.refreshProfile, routeState?.profileSessionId]);

  useEffect(() => {
    const handlePostPatch = (event: Event) => {
      const patch = (event as CustomEvent<MobilePostStatPatch>).detail;
      if (!patch?.id) return;
      setPosts((current) => {
        const exists = current.some((post) => getMobilePostId(post) === Number(patch.id));
        const patched = current.map((post) => applyPostStatPatch(post, patch));
        return patch.created && patch.post && !exists
          ? applyStoredPostStatPatches([
              { ...patch.post, is_collection: false },
              ...patched,
            ])
          : patched;
      });
      setCollectedPosts((current) =>
        patch.is_collection === false || patch.removed_from_collection
          ? current.filter((post) => getMobilePostId(post) !== Number(patch.id))
          : current.map((post) => applyPostStatPatch(post, patch)),
      );
      profileCache.forEach((cache) => {
        const exists = cache.posts.some(
          (post) => getMobilePostId(post) === Number(patch.id),
        );
        const patchedPosts = cache.posts.map((post) => applyPostStatPatch(post, patch));
        cache.posts =
          patch.created && patch.post && !exists
            ? applyStoredPostStatPatches([
                { ...patch.post, is_collection: false },
                ...patchedPosts,
              ])
            : patchedPosts;
        cache.collectedPosts =
          patch.is_collection === false || patch.removed_from_collection
            ? cache.collectedPosts.filter(
                (post) => getMobilePostId(post) !== Number(patch.id),
              )
            : cache.collectedPosts.map((post) => applyPostStatPatch(post, patch));
        cache.postRevision = getPostRevision();
      });
    };
    window.addEventListener(MOBILE_POST_STAT_EVENT, handlePostPatch);
    window.addEventListener(MOBILE_POST_COLLECTION_EVENT, handlePostPatch);
    window.addEventListener(MOBILE_POST_CREATED_EVENT, handlePostPatch);
    return () => {
      window.removeEventListener(MOBILE_POST_STAT_EVENT, handlePostPatch);
      window.removeEventListener(MOBILE_POST_COLLECTION_EVENT, handlePostPatch);
      window.removeEventListener(MOBILE_POST_CREATED_EVENT, handlePostPatch);
    };
  }, []);

  useEffect(() => {
    const handleSipScorePatch = (event: Event) => {
      const patch = (event as CustomEvent<SipScorePatch>).detail;
      if (!patch?.id) return;
      setCollectedRankings((current) =>
        patch.is_collected === false || patch.removed_from_collection
          ? current.filter((item) => Number(item.sip_score?.id) !== Number(patch.id))
          : applyStoredSipScorePatches(current),
      );
      profileCache.forEach((cache) => {
        cache.collectedRankings =
          patch.is_collected === false || patch.removed_from_collection
            ? cache.collectedRankings.filter(
                (item) => Number(item.sip_score?.id) !== Number(patch.id),
              )
            : applyStoredSipScorePatches(cache.collectedRankings);
        cache.sipScoreRevision = getSipScoreRevision();
      });
    };
    window.addEventListener(MOBILE_SIP_SCORE_EVENT, handleSipScorePatch);
    window.addEventListener(MOBILE_SIP_SCORE_COLLECTION_EVENT, handleSipScorePatch);
    return () => {
      window.removeEventListener(MOBILE_SIP_SCORE_EVENT, handleSipScorePatch);
      window.removeEventListener(MOBILE_SIP_SCORE_COLLECTION_EVENT, handleSipScorePatch);
    };
  }, []);

  useEffect(() => {
    const handleFollowPatch = (event: Event) => {
      const patch = (event as CustomEvent<MobileFollowPatch>).detail;
      if (!patch?.targetUserId) return;
      setProfile((current) => {
        if (!current?.id) return current;
        if (current.id === patch.targetUserId) {
          return {
            ...current,
            is_following: patch.is_following,
            follower_count: patch.follower_count ?? current.follower_count,
          };
        }
        if (current.id === patch.currentUserId) {
          return {
            ...current,
            following_count: patch.following_count ?? current.following_count,
          };
        }
        return current;
      });
      applyMobileProfileFollowPatch(patch);
    };
    window.addEventListener(MOBILE_FOLLOW_EVENT, handleFollowPatch);
    return () => window.removeEventListener(MOBILE_FOLLOW_EVENT, handleFollowPatch);
  }, []);

  useEffect(() => {
    if (!isMine) return;
    let stopped = false;
    const refreshUnread = () => {
      if (stopped || !localStorage.getItem('token')) return;
      refreshNotificationStore()
        .then((notifications) => {
          if (!stopped) {
            setProfileHasUnread(
              useNotification.getState().totalUnreadCount > 0 ||
                notifications.some((notice) => !notice.read),
            );
          }
        })
        .catch((err) => {
          console.error('刷新通知红点失败:', err);
        });
    };
    const handleVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshUnread();
      }
    };

    refreshUnread();
    window.addEventListener('focus', refreshUnread);
    document.addEventListener('visibilitychange', handleVisible);
    const timer = window.setInterval(refreshUnread, notificationPollIntervalMs);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshUnread);
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, [isMine]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const follow = async () => {
    if (!profile?.id) return;
    const res = await mobileApi.user.follow(profile.id);
    if (res.code !== 0) {
      message.error(res.message);
      return;
    }
    const nextProfile = {
      ...profile,
      is_following: res.data.is_following,
      follower_count: res.data.follower_count,
    };
    setProfile(nextProfile);
    const cached = profileCache.get(profile.id);
    if (cached) cached.profile = nextProfile;
    if (currentUserId) {
      const myCached = profileCache.get(currentUserId);
      if (myCached) {
        myCached.profile = {
          ...myCached.profile,
          following_count: res.data.following_count,
        };
      }
    }
    emitMobileFollowPatch({
      targetUserId: profile.id,
      currentUserId,
      targetUser: nextProfile,
      is_following: res.data.is_following,
      following_count: res.data.following_count,
      follower_count: res.data.follower_count,
    });
  };

  const logout = () => {
    clearAuthStorage();
    nav('/login');
  };

  const goBack = () => {
    loadVersionRef.current += 1;
    nav(-1);
  };

  const refreshProfile = async () => {
    const target = profile?.id || userId || currentUserId;
    emitMobileProfileRefresh(target ? Number(target) : undefined);
    await load({ force: true });
  };

  if (loading && !profile) {
    return (
      <MobileShell title="我的" tabs showTopBar={false}>
        <LoadingState text="正在读取身份卡..." />
      </MobileShell>
    );
  }

  if (error && !profile) {
    return (
      <MobileShell title="我的" tabs showTopBar={false}>
        <ErrorState text={error} onRetry={load} />
      </MobileShell>
    );
  }

  if (!profile) return null;
  const profileId = profile.id || userId || currentUserId;

  return (
    <MobileShell
      title={isMine ? '我的主页' : '他的主页'}
      tabs
      borderlessTopBar
      showTopBar={false}
    >
      <PullToRefresh disabled={loading} onRefresh={refreshProfile}>
        <Hero>
          {!isMine ? (
            <HeroBackButton type="button" onClick={goBack} aria-label="返回">
              <img src={mastergoAssets.icons.backButtonDark} alt="" />
            </HeroBackButton>
          ) : null}
          <HeroActions>
            {isMine ? (
              <TitleIconButton
                type="button"
                onClick={() => nav('/notice')}
                aria-label="消息"
              >
                <DesignIcon name="bell" size={23} />
                {totalUnreadCount > 0 || profileHasUnread ? (
                  <span className="dot" />
                ) : null}
              </TitleIconButton>
            ) : null}
          </HeroActions>
          <ProfilePanel>
            <Avatar url={profile.avatar || profile.avatar_url} size={100} bordered />
            <NameRow>
              <h1>{profile.name || '茶友'}</h1>
              {isMine ? (
                <button type="button" onClick={() => nav(`/user/${profileId}/seting`)}>
                  <img src={mastergoAssets.icons.editPencilGray} alt="编辑" />
                </button>
              ) : null}
            </NameRow>
            <Signature>{profile.signature || '还没有填写简介'}</Signature>
            <Counts>
              <button
                type="button"
                onClick={() =>
                  nav(`/user/${profileId}/following`, { state: internalListState() })
                }
                aria-label="查看关注列表"
              >
                <strong>{profile.following_count || 0}</strong>关注
              </button>
              <button
                type="button"
                onClick={() =>
                  nav(`/user/${profileId}/followers`, { state: internalListState() })
                }
                aria-label="查看粉丝列表"
              >
                <strong>{profile.follower_count || 0}</strong>粉丝
              </button>
            </Counts>
            {!isMine ? (
              <ActionBar>
                <VisitorButton onClick={() => nav(`/user/chat?target_id=${profileId}`)}>
                  私信
                </VisitorButton>
                <VisitorButton primary onClick={follow}>
                  {profile.is_following ? '已关注' : '+ 关注'}
                </VisitorButton>
              </ActionBar>
            ) : null}
          </ProfilePanel>
        </Hero>
        <Menu>
          <MenuItem
            onClick={() =>
              setExpanded((current) => ({
                posts: !current.posts,
                collections: false,
              }))
            }
          >
            <DesignIcon name="post" size={23} />
            <span>{isMine ? '我发过的帖子' : '发过的帖子'}</span>
            <span className="chevron">
              <DesignIcon name={expanded.posts ? 'chevronUp' : 'chevronDown'} size={22} />
            </span>
          </MenuItem>
          {expanded.posts ? (
            <ExpandedPanel>
              <ExpandedPosts id="profile-posts">
                {sectionsLoading ? (
                  <MiniEmpty>正在读取发过的帖子...</MiniEmpty>
                ) : posts.length ? (
                  posts
                    .slice(0, 1)
                    .map((post) => (
                      <PostCard key={post.id} post={post} variant="compactOwn" />
                    ))
                ) : (
                  <MiniEmpty>{isMine ? '还没有发过帖子' : 'Ta 还没有发过帖子'}</MiniEmpty>
                )}
                {!sectionsLoading && posts.length > 1 ? (
                  <ViewAllButton
                    type="button"
                    onClick={() =>
                      nav(profileListPath(profileId, 'published'), {
                        state: internalListState(),
                      })
                    }
                  >
                    <span>查看全部帖子</span>
                    <DesignIcon name="chevronRight" size={18} />
                  </ViewAllButton>
                ) : null}
              </ExpandedPosts>
            </ExpandedPanel>
          ) : null}
          <MenuItem
            onClick={() =>
              setExpanded((current) => {
                const nextCollections = !current.collections;
                if (!nextCollections) {
                  setCollectionExpanded({ posts: false, rankings: false });
                }
                return {
                  posts: false,
                  collections: nextCollections,
                };
              })
            }
          >
            <DesignIcon name="star" size={24} />
            <span>
              {isMine ? '我的收藏' : canViewCollection ? '公开收藏' : '收藏未公开'}
            </span>
            <span className="chevron">
              <DesignIcon
                name={expanded.collections ? 'chevronUp' : 'chevronDown'}
                size={22}
              />
            </span>
          </MenuItem>
          {expanded.collections ? (
            <ExpandedPanel>
              {!canViewCollection ? (
                <MiniEmpty>对方打开了隐私权限哦</MiniEmpty>
              ) : (
                <>
                  <CollectionGroupButton
                    type="button"
                    onClick={() =>
                      setCollectionExpanded((current) => ({
                        ...current,
                        posts: !current.posts,
                      }))
                    }
                  >
                    <span>帖子收藏</span>
                    <DesignIcon
                      name={collectionExpanded.posts ? 'chevronUp' : 'chevronDown'}
                      size={18}
                    />
                  </CollectionGroupButton>
                  {collectionExpanded.posts ? (
                    <ExpandedPosts>
                      {sectionsLoading ? (
                        <MiniEmpty>正在读取收藏帖子...</MiniEmpty>
                      ) : collectedPosts.length ? (
                        collectedPosts
                          .slice(0, 1)
                          .map((post) => <PostCard key={post.id} post={post} />)
                      ) : (
                        <MiniEmpty>
                          {isMine ? '还没有收藏帖子' : 'Ta 还没有收藏帖子'}
                        </MiniEmpty>
                      )}
                      {!sectionsLoading && collectedPosts.length > 1 ? (
                        <ViewAllButton
                          type="button"
                          onClick={() =>
                            nav(profileListPath(profileId, 'post'), {
                              state: internalListState(),
                            })
                          }
                        >
                          <span>查看全部收藏帖子</span>
                          <DesignIcon name="chevronRight" size={18} />
                        </ViewAllButton>
                      ) : null}
                    </ExpandedPosts>
                  ) : null}
                  <CollectionGroupButton
                    type="button"
                    onClick={() =>
                      setCollectionExpanded((current) => ({
                        ...current,
                        rankings: !current.rankings,
                      }))
                    }
                  >
                    <span>榜单收藏</span>
                    <DesignIcon
                      name={collectionExpanded.rankings ? 'chevronUp' : 'chevronDown'}
                      size={18}
                    />
                  </CollectionGroupButton>
                  {collectionExpanded.rankings ? (
                    <ExpandedPosts>
                      {sectionsLoading ? (
                        <MiniEmpty>正在读取收藏榜单...</MiniEmpty>
                      ) : collectedRankings.length ? (
                        collectedRankings.slice(0, 1).map((item) => {
                          const ranking = item.sip_score || {};
                          return (
                            <RankingCard
                              key={ranking.id || ranking.name}
                              type="button"
                              onClick={() =>
                                ranking.id && nav(`/sip-score/${ranking.id}`)
                              }
                            >
                              <span
                                className="cover"
                                style={
                                  ranking.cover_img
                                    ? { backgroundImage: `url(${ranking.cover_img})` }
                                    : undefined
                                }
                              />
                              <span>
                                <h3>{ranking.name || '未命名榜单'}</h3>
                                <p>{ranking.description || '暂无简介'}</p>
                              </span>
                            </RankingCard>
                          );
                        })
                      ) : (
                        <MiniEmpty>
                          {isMine ? '还没有收藏榜单' : 'Ta 还没有收藏榜单'}
                        </MiniEmpty>
                      )}
                      {!sectionsLoading && collectedRankings.length > 1 ? (
                        <ViewAllButton
                          type="button"
                          onClick={() =>
                            nav(profileListPath(profileId, 'sipScore'), {
                              state: internalListState(),
                            })
                          }
                        >
                          <span>查看全部收藏榜单</span>
                          <DesignIcon name="chevronRight" size={18} />
                        </ViewAllButton>
                      ) : null}
                    </ExpandedPosts>
                  ) : null}
                </>
              )}
            </ExpandedPanel>
          ) : null}
          {isMine ? (
            <ActionGroup>
              <MenuItem onClick={() => nav('/feedback')}>
                <DesignIcon name="feedback" size={24} />
                <span>反馈与建议</span>
                <span />
              </MenuItem>
              <MenuItem onClick={logout}>
                <DesignIcon name="power" size={24} />
                <span>退出登录</span>
                <span />
              </MenuItem>
            </ActionGroup>
          ) : null}
        </Menu>
      </PullToRefresh>
      <BackToTopButton offset={128} />
      <MobileToast text={toast} onClose={() => setToast('')} />
    </MobileShell>
  );
};

export default Profile;
