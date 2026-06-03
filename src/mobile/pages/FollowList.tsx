import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileAvatar from '../components/MobileAvatar';
import DesignIcon from '../components/DesignIcon';
import { mobileApi, MobileUser } from '../api';
import { mobileMotion, mobilePalette, mobileRadius, Section } from '../styles';
import { clearMobileProfileCache } from './Profile';

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

const FollowList: React.FC = () => {
  const { user_id } = useParams();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const userId = Number(user_id);
  const mode = useMemo<'following' | 'followers'>(
    () => (pathname.endsWith('/followers') ? 'followers' : 'following'),
    [pathname],
  );
  const [users, setUsers] = useState<MobileUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState(
    Number(localStorage.getItem('userId')) || 0,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);

  const title = mode === 'followers' ? '粉丝' : '关注';

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const [listRes, myProfileRes] = await Promise.allSettled([
        mobileApi.user.followList(userId, mode, { limit: 50, page: 0 }),
        currentUserId ? Promise.resolve(null) : mobileApi.user.myProfile(),
      ]);
      if (myProfileRes.status === 'fulfilled' && myProfileRes.value?.code === 0) {
        const id = myProfileRes.value.data.id || 0;
        setCurrentUserId(id);
        if (id) localStorage.setItem('userId', String(id));
      }
      if (listRes.status !== 'fulfilled' || listRes.value.code !== 0) {
        const msg =
          listRes.status === 'fulfilled' ? listRes.value.message : '列表加载失败';
        setError(msg || '列表加载失败');
        return;
      }
      setUsers(listRes.value.data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '列表加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId, mode]);

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
      setUsers((current) =>
        mode === 'following' && userId === currentUserId && !res.data.is_following
          ? current.filter((item) => item.id !== target.id)
          : current.map((item) =>
              item.id === target.id
                ? {
                    ...item,
                    is_following: res.data.is_following,
                    follower_count: res.data.follower_count,
                  }
                : item,
            ),
      );
      clearMobileProfileCache(target.id);
      clearMobileProfileCache(userId);
      if (currentUserId) clearMobileProfileCache(currentUserId);
    } finally {
      setPendingId(null);
    }
  };

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
        <ErrorState text={error} onRetry={load} />
      </MobileShell>
    );
  }

  return (
    <MobileShell title={title} back tabs={false}>
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
      ) : (
        <EmptyState
          title={mode === 'followers' ? '还没有粉丝' : '还没有关注的人'}
          text={mode === 'followers' ? '被关注后会出现在这里。' : '去看看其他茶友吧。'}
        />
      )}
    </MobileShell>
  );
};

export default FollowList;
