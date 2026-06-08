import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileAvatar from '../components/MobileAvatar';
import DesignIcon from '../components/DesignIcon';
import PullToRefresh from '../components/PullToRefresh';
import { mobileApi, MobileUser } from '../api';
import {
  emitMobileFollowPatch,
  getFollowRevision,
  MOBILE_FOLLOW_EVENT,
  MobileFollowPatch,
} from '../followEvents';
import { mobileMotion, mobilePalette, mobileRadius, Section } from '../styles';
import { applyMobileProfileFollowPatch } from './Profile';
import {
  emitMobileProfileRefresh,
  getMobileProfileRefreshRevision,
  hasActiveMobileProfileSession,
  MOBILE_PROFILE_REFRESH_EVENT,
  MobileProfileRefreshPatch,
  MobileProfileRouteState,
} from '../profileSession';

const List = styled(Section)`
  min-height: calc(100dvh - 56px - env(safe-area-inset-top));
  padding: 12px 0 22px;
  background: ${mobilePalette.bg};
  border: 0;
`;

const UserItem = styled.article`
  width: calc(100% - 28px);
  min-height: 82px;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  margin: 0 auto 10px;
  padding: 13px 14px;
  border-radius: ${mobileRadius.xl};
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.055);
`;

const UserMain = styled.button`
  min-width: 0;
  display: grid;
  gap: 5px;
  padding: 0;
  background: transparent;
  text-align: left;
  h3 {
    margin: 0;
    overflow: hidden;
    color: ${mobilePalette.ink};
    font-size: 15px;
    font-weight: 850;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p {
    margin: 0;
    overflow: hidden;
    color: ${mobilePalette.muted};
    font-size: 12px;
    line-height: 1.45;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .counts {
    display: inline-flex;
    gap: 8px;
    color: ${mobilePalette.mutedSoft};
    font-size: 11px;
  }
`;

const FollowButton = styled.button<{ active?: boolean }>`
  min-width: 70px;
  height: 32px;
  padding: 0 12px;
  border-radius: ${mobileRadius.pill};
  border: 1px solid ${(props) => (props.active ? mobilePalette.lineSoft : '#fe9800')};
  background: ${(props) => (props.active ? '#fff' : '#fe9800')};
  color: ${(props) => (props.active ? mobilePalette.muted : '#fff')};
  font-size: 12px;
  font-weight: 800;
  transition: transform ${mobileMotion.fast}, opacity ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
  }
  &:disabled {
    opacity: 0.55;
  }
`;

const AvatarButton = styled.button`
  width: 46px;
  height: 46px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
`;

type FollowMode = 'following' | 'followers';

type FollowListCacheState = {
  users: MobileUser[];
  currentUserId: number;
  followRevision: number;
  profileRefreshRevision: number;
};

const followListCache = new Map<string, FollowListCacheState>();
const followListCacheKey = (userId: number, mode: FollowMode) => `${userId}:${mode}`;

const clearMobileFollowListCache = (userId?: number) => {
  if (!userId) {
    followListCache.clear();
    return;
  }
  followListCache.delete(followListCacheKey(userId, 'following'));
  followListCache.delete(followListCacheKey(userId, 'followers'));
};

const applyFollowPatchToUsers = (
  users: MobileUser[],
  ownerUserId: number,
  mode: FollowMode,
  patch: MobileFollowPatch,
) => {
  const shouldRemove =
    mode === 'following' &&
    ownerUserId === patch.currentUserId &&
    patch.is_following === false;
  const patchedUsers = shouldRemove
    ? users.filter((item) => item.id !== patch.targetUserId)
    : users.map((item) =>
        item.id === patch.targetUserId
          ? {
              ...item,
              is_following: patch.is_following,
              follower_count: patch.follower_count ?? item.follower_count,
            }
          : item.id === patch.currentUserId
          ? {
              ...item,
              following_count: patch.following_count ?? item.following_count,
            }
          : item,
      );
  const targetUser = patch.targetUser;
  const shouldInsert =
    mode === 'following' &&
    ownerUserId === patch.currentUserId &&
    patch.is_following &&
    targetUser &&
    !patchedUsers.some((item) => item.id === patch.targetUserId);
  return shouldInsert
    ? [
        {
          ...targetUser,
          is_following: true,
          follower_count: patch.follower_count ?? targetUser.follower_count,
        },
        ...patchedUsers,
      ]
    : patchedUsers;
};

const applyFollowPatchToFollowCaches = (patch: MobileFollowPatch) => {
  followListCache.forEach((cache, key) => {
    const [ownerId, ownerMode] = key.split(':');
    cache.users = applyFollowPatchToUsers(
      cache.users,
      Number(ownerId),
      ownerMode === 'followers' ? 'followers' : 'following',
      patch,
    );
    cache.followRevision = getFollowRevision();
  });
};

const followCacheListenerKey = '__forumMobileFollowCacheListener';

if (
  typeof window !== 'undefined' &&
  !(window as typeof window & Record<string, boolean>)[followCacheListenerKey]
) {
  (window as typeof window & Record<string, boolean>)[followCacheListenerKey] = true;
  window.addEventListener(MOBILE_FOLLOW_EVENT, (event) => {
    const patch = (event as CustomEvent<MobileFollowPatch>).detail;
    if (patch?.targetUserId) applyFollowPatchToFollowCaches(patch);
  });
  window.addEventListener(MOBILE_PROFILE_REFRESH_EVENT, (event) => {
    const patch = (event as CustomEvent<MobileProfileRefreshPatch>).detail;
    clearMobileFollowListCache(patch?.userId);
  });
}

const FollowList: React.FC = () => {
  const { user_id } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const { pathname, state } = location;
  const routeState = state as MobileProfileRouteState | null;
  const userId = Number(user_id);
  const mode = useMemo<FollowMode>(
    () => (pathname.endsWith('/followers') ? 'followers' : 'following'),
    [pathname],
  );
  const initialCurrentUserId = Number(localStorage.getItem('userId')) || 0;
  const isInitialOwnList = Boolean(
    initialCurrentUserId && userId === initialCurrentUserId,
  );
  const shouldRefreshOwnFollowers = isInitialOwnList && mode === 'followers';
  const shouldForceInitialLoad =
    Boolean(routeState?.forceReload) ||
    shouldRefreshOwnFollowers ||
    (!isInitialOwnList && !hasActiveMobileProfileSession(routeState, userId));
  const initialCache = userId
    ? followListCache.get(followListCacheKey(userId, mode))
    : undefined;
  const initialUsableCache =
    !shouldForceInitialLoad &&
    initialCache &&
    initialCache.followRevision === getFollowRevision() &&
    initialCache.profileRefreshRevision === getMobileProfileRefreshRevision(userId)
      ? initialCache
      : undefined;
  const [users, setUsers] = useState<MobileUser[]>(initialUsableCache?.users || []);
  const [currentUserId, setCurrentUserId] = useState(
    initialUsableCache?.currentUserId || initialCurrentUserId,
  );
  const [loading, setLoading] = useState(!initialUsableCache);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const requestSeqRef = useRef(0);

  const title = mode === 'followers' ? '粉丝' : '关注';

  const refreshList = async () => {
    emitMobileProfileRefresh(userId || undefined);
    await load({ force: true });
  };

  const applyCache = (cache: FollowListCacheState) => {
    setUsers(cache.users);
    setCurrentUserId(cache.currentUserId);
    setError('');
    setLoading(false);
  };

  const load = async (options?: { force?: boolean }) => {
    if (!userId) return;
    const key = followListCacheKey(userId, mode);
    const cached = followListCache.get(key);
    const usableCache =
      cached &&
      cached.followRevision === getFollowRevision() &&
      cached.profileRefreshRevision === getMobileProfileRefreshRevision(userId)
        ? cached
        : undefined;
    if (usableCache && !options?.force) {
      applyCache(usableCache);
      return;
    }
    const requestSeq = ++requestSeqRef.current;
    setLoading(options?.force ? true : !usableCache);
    if (!usableCache || options?.force) {
      setUsers([]);
    }
    setError('');
    try {
      const [listRes, myProfileRes] = await Promise.allSettled([
        mobileApi.user.followList(userId, mode, { limit: 50, page: 0 }),
        currentUserId ? Promise.resolve(null) : mobileApi.user.myProfile(),
      ]);
      if (requestSeq !== requestSeqRef.current) return;
      let nextCurrentUserId = currentUserId;
      if (myProfileRes.status === 'fulfilled' && myProfileRes.value?.code === 0) {
        const id = myProfileRes.value.data.id || 0;
        nextCurrentUserId = id;
        setCurrentUserId(id);
        if (id) localStorage.setItem('userId', String(id));
      }
      if (listRes.status !== 'fulfilled' || listRes.value.code !== 0) {
        const msg =
          listRes.status === 'fulfilled' ? listRes.value.message : '列表加载失败';
        const text = msg || '列表加载失败';
        if (usableCache) {
          message.error(text);
        } else {
          setError(text);
        }
        return;
      }
      const nextUsers = listRes.value.data.users || [];
      setUsers(nextUsers);
      followListCache.set(key, {
        users: nextUsers,
        currentUserId: nextCurrentUserId,
        followRevision: getFollowRevision(),
        profileRefreshRevision: getMobileProfileRefreshRevision(userId),
      });
    } catch (err) {
      if (requestSeq !== requestSeqRef.current) return;
      const text = err instanceof Error ? err.message : '列表加载失败';
      if (usableCache) {
        message.error(text);
      } else {
        setError(text);
      }
    } finally {
      if (requestSeq === requestSeqRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const isOwnList = Boolean(currentUserId && userId === currentUserId);
    const shouldRefreshCurrentFollowers = isOwnList && mode === 'followers';
    const shouldForce =
      Boolean(routeState?.forceReload) ||
      shouldRefreshCurrentFollowers ||
      (!isOwnList && !hasActiveMobileProfileSession(routeState, userId));
    load({ force: shouldForce });
    if (routeState?.forceReload) {
      nav(pathname, { replace: true, state: null });
    }
  }, [userId, mode, routeState?.forceReload, routeState?.profileSessionId]);

  const toggleFollow = async (target: MobileUser) => {
    if (!target.id) return;
    if (!localStorage.getItem('token')) {
      nav('/login');
      return;
    }
    setPendingId(target.id);
    try {
      const res = await mobileApi.user.follow(target.id);
      if (res.code !== 0) {
        message.error(res.message || '操作失败');
        return;
      }
      const patch: MobileFollowPatch = {
        targetUserId: target.id,
        currentUserId,
        targetUser: target,
        is_following: res.data.is_following,
        following_count: res.data.following_count,
        follower_count: res.data.follower_count,
      };
      emitMobileFollowPatch(patch);
      applyMobileProfileFollowPatch(patch);
    } finally {
      setPendingId(null);
    }
  };

  useEffect(() => {
    const handleFollowPatch = (event: Event) => {
      const patch = (event as CustomEvent<MobileFollowPatch>).detail;
      if (!patch?.targetUserId) return;
      setUsers((current) => applyFollowPatchToUsers(current, userId, mode, patch));
    };
    window.addEventListener(MOBILE_FOLLOW_EVENT, handleFollowPatch);
    return () => window.removeEventListener(MOBILE_FOLLOW_EVENT, handleFollowPatch);
  }, [mode, userId]);

  if (loading && !users.length) {
    return (
      <MobileShell title={title} back tabs={false}>
        <LoadingState text={`正在读取${title}...`} />
      </MobileShell>
    );
  }

  if (error && !users.length) {
    return (
      <MobileShell title={title} back tabs={false}>
        <ErrorState text={error} onRetry={refreshList} />
      </MobileShell>
    );
  }

  return (
    <MobileShell title={title} back tabs={false}>
      <PullToRefresh
        disabled={loading}
        indicatorTop="calc(66px + env(safe-area-inset-top))"
        onRefresh={refreshList}
      >
        {users.length ? (
          <List>
            {users.map((user) => {
              const isMe = Boolean(currentUserId && user.id === currentUserId);
              return (
                <UserItem key={user.id}>
                  <AvatarButton
                    type="button"
                    onClick={() => user.id && nav(`/user/${user.id}`)}
                    aria-label={`查看 ${user.name || '茶友'} 的主页`}
                  >
                    <MobileAvatar url={user.avatar || user.avatar_url} size={46} />
                  </AvatarButton>
                  <UserMain
                    type="button"
                    onClick={() => user.id && nav(`/user/${user.id}`)}
                  >
                    <h3>{user.name || '茶友'}</h3>
                    <p>{user.signature || '还没有填写简介'}</p>
                    <span className="counts">
                      <span>{user.following_count || 0} 关注</span>
                      <span>{user.follower_count || 0} 粉丝</span>
                    </span>
                  </UserMain>
                  {isMe ? (
                    <DesignIcon name="user" size={22} color={mobilePalette.mutedSoft} />
                  ) : (
                    <FollowButton
                      type="button"
                      active={user.is_following}
                      disabled={pendingId === user.id}
                      onClick={() => toggleFollow(user)}
                    >
                      {user.is_following ? '已关注' : '+ 关注'}
                    </FollowButton>
                  )}
                </UserItem>
              );
            })}
          </List>
        ) : error ? (
          <ErrorState text={error} onRetry={refreshList} />
        ) : (
          <EmptyState
            title={mode === 'followers' ? '还没有粉丝' : '还没有关注的人'}
            text={mode === 'followers' ? '被关注后会出现在这里。' : '去看看其他茶友吧。'}
          />
        )}
      </PullToRefresh>
    </MobileShell>
  );
};

export default FollowList;
