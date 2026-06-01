import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import MobileAvatar from '../components/MobileAvatar';
import DesignIcon from '../components/DesignIcon';
import { mobilePalette, Section } from '../styles';
import { mobileApi, MobilePost, MobileUser, SipScoreWithEntries } from '../api';
import { mastergoAssets } from '../assets/mastergo';

const Hero = styled.section`
  position: relative;
  min-height: 348px;
  overflow: hidden;
  background: #fff;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: -40px;
    height: 336px;
    background: url(${mastergoAssets.decorations.profileHeroCupBg}) center top /
      calc(100% + 69px) auto no-repeat;
  }
`;

const NoticeIcon = styled.button`
  position: absolute;
  right: 14px;
  top: 18px;
  z-index: 4;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  background: transparent;
  img {
    width: 26px;
    height: 26px;
  }
`;

const HeroActionIcon = styled(NoticeIcon)`
  img {
    width: auto;
    height: auto;
  }
`;

const ProfilePanel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  min-height: 208px;
  padding: 78px 26px 18px;
  isolation: isolate;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: rgba(255, 255, 255, 0.94);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    clip-path: polygon(0 13%, 100% 0, 100% 100%, 0 100%);
  }
`;

const Avatar = styled(MobileAvatar)`
  position: absolute;
  left: 28px;
  top: -28px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0;
  h1 {
    margin: 0;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 24px;
    line-height: 1.1;
    font-weight: 500;
    color: #1a202c;
  }
  .anticon {
    color: #7f838a;
    font-size: 16px;
  }
  button {
    width: 22px;
    height: 22px;
    background: transparent;
    img {
      width: 15px;
      height: 15px;
    }
  }
`;

const Signature = styled.p`
  margin: 12px 0 14px;
  max-width: 286px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #7f838a;
  font-size: 14px;
`;

const Counts = styled.div`
  display: flex;
  gap: 48px;
  color: #7f838a;
  font-size: 14px;
  strong {
    display: block;
    margin-bottom: 4px;
    color: #3d3d3d;
    font-size: 16px;
    font-weight: 400;
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
  height: 25px;
  min-width: 53px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.primary ? '#fe9800' : '#ffc641')};
  background: ${(props) => (props.primary ? '#fe9800' : '#fff')};
  color: ${(props) => (props.primary ? '#fff' : '#fe9800')};
  font-size: 12px;
`;

const Menu = styled(Section)`
  margin-top: 0;
  background: #fff;
  border-top: 1px solid rgba(60, 60, 67, 0.12);
  border-bottom: 0;
`;

const MenuItem = styled.button`
  width: 100%;
  height: 70px;
  display: grid;
  grid-template-columns: 50px 1fr 32px;
  align-items: center;
  padding: 0 22px;
  background: transparent;
  border-bottom: 0;
  text-align: left;
  color: #3d3d3d;
  font-size: 16px;
  .chevron {
    justify-self: end;
  }
  transition: background 0.18s ease;
  &:active {
    background: rgba(0, 0, 0, 0.035);
  }
  &:last-child {
    border-bottom: 0;
  }
`;

const ExpandedPanel = styled.div`
  background: #fff;
  border-bottom: 0;
`;

const ExpandedPosts = styled.div`
  min-height: 118px;
  padding: 0 0 8px;
`;

const ViewAll = styled.button`
  display: block;
  margin: 14px auto 18px;
  background: transparent;
  color: #ffc641;
  font-size: 13px;
  font-weight: 500;
`;

const MiniEmpty = styled.div`
  min-height: 112px;
  display: grid;
  place-items: center;
  color: #a0a5ad;
  font-size: 13px;
`;

const CollectionGroupButton = styled.button`
  width: calc(100% - 36px);
  min-height: 48px;
  display: grid;
  grid-template-columns: 1fr 22px;
  align-items: center;
  margin: 8px 18px;
  padding: 0 14px;
  text-align: left;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  color: #7f838a;
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.06);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  &:active {
    transform: scale(0.99);
    box-shadow: 0 5px 14px rgba(16, 24, 40, 0.05);
  }
  & + & {
    margin-top: 12px;
  }
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
  border-radius: 8px;
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
  border-top: 1px solid rgba(60, 60, 67, 0.1);
`;

const CenterToast = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 80;
  transform: translate(-50%, -50%);
  width: 154px;
  height: 70px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(98, 103, 111, 0.76);
  color: #fff;
  font-size: 18px;
`;

const Profile: React.FC = () => {
  const { user_id } = useParams();
  const { state } = useLocation();
  const userId = Number(user_id);
  const nav = useNavigate();
  const myId = Number(localStorage.getItem('userId')) || 0;
  const [currentUserId, setCurrentUserId] = useState(myId);
  const [profile, setProfile] = useState<MobileUser | null>(null);
  const [posts, setPosts] = useState<MobilePost[]>([]);
  const [collectedPosts, setCollectedPosts] = useState<MobilePost[]>([]);
  const [collectedRankings, setCollectedRankings] = useState<SipScoreWithEntries[]>([]);
  const [expanded, setExpanded] = useState<Record<'posts' | 'collections', boolean>>({
    posts: false,
    collections: false,
  });
  const [collectionExpanded, setCollectionExpanded] = useState({
    posts: false,
    rankings: false,
  });
  const [toast, setToast] = useState<string>((state as any)?.profileToast || '');
  const isMine = Boolean(
    !userId ||
      (currentUserId && userId === currentUserId) ||
      (profile?.id && currentUserId && profile.id === currentUserId),
  );

  const load = async () => {
    let resolvedCurrentUserId = currentUserId;
    if (!resolvedCurrentUserId) {
      try {
        const myProfileRes = await mobileApi.user.myProfile();
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
      signature: '热爱生活，喜欢分享校园趣事',
      following_count: 0,
      follower_count: 0,
      is_following: false,
    });

    let nextProfile: MobileUser | null = null;
    try {
      const profileRes = target
        ? await mobileApi.user.profile(target)
        : await mobileApi.user.myProfile();
      if (profileRes.code === 0) nextProfile = profileRes.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        try {
          const myProfileRes = await mobileApi.user.myProfile();
          if (myProfileRes.code === 0) nextProfile = myProfileRes.data;
        } catch {
          nextProfile = fallbackProfile(target);
        }
      }
    }

    const effectiveProfile = nextProfile || fallbackProfile(target);
    const effectiveId = effectiveProfile.id || target;
    setProfile(effectiveProfile);

    if (!effectiveId) return;
    const [postsRes, collectedPostsRes, collectedRankingsRes] =
      await Promise.allSettled([
        mobileApi.posts.published(effectiveId, { limit: 10 }),
        mobileApi.collection.list(effectiveId, { limit: 3, page: 0 }),
        mobileApi.sipScore.collected(effectiveId, { limit: 3, page: 0 }),
      ]);
    if (postsRes.status === 'fulfilled' && postsRes.value.code === 0) {
      setPosts(postsRes.value.data.posts || []);
    } else {
      setPosts([]);
    }
    if (collectedPostsRes.status === 'fulfilled' && collectedPostsRes.value.code === 0) {
      setCollectedPosts(collectedPostsRes.value.data.posts || []);
    } else {
      setCollectedPosts([]);
    }
    if (
      collectedRankingsRes.status === 'fulfilled' &&
      collectedRankingsRes.value.code === 0
    ) {
      setCollectedRankings(collectedRankingsRes.value.data.sip_scores || []);
    } else {
      setCollectedRankings([]);
    }
  };

  useEffect(() => {
    load();
  }, [userId, currentUserId]);

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
    setProfile({
      ...profile,
      is_following: res.data.is_following,
      follower_count: res.data.follower_count,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  if (!profile) {
    return (
      <MobileShell title="我的" tabs>
        <EmptyState text="加载中..." />
      </MobileShell>
    );
  }

  return (
    <MobileShell
      title={isMine ? '我的主页' : '他的主页'}
      tabs
      borderlessTopBar
    >
      <Hero>
        {isMine ? (
          <NoticeIcon onClick={() => nav('/notice')}>
            <img src={mastergoAssets.icons.notificationBellUnread} alt="" />
          </NoticeIcon>
        ) : (
          <HeroActionIcon type="button">
            <DesignIcon name="more" size={24} />
          </HeroActionIcon>
        )}
        <ProfilePanel>
          <Avatar url={profile.avatar || profile.avatar_url} size={100} bordered />
          <NameRow>
            <h1>{profile.name || '茶友'}</h1>
            {isMine ? (
              <button type="button" onClick={() => nav(`/user/${profile.id}/seting`)}>
                <img src={mastergoAssets.icons.editPencilGray} alt="编辑" />
              </button>
            ) : null}
          </NameRow>
          <Signature>{profile.signature || '热爱生活，喜欢分享校园趣事'}</Signature>
          <Counts>
            <span>
              <strong>{profile.following_count || 0}</strong>关注
            </span>
            <span>
              <strong>{profile.follower_count || 0}</strong>粉丝
            </span>
          </Counts>
          {!isMine ? (
            <ActionBar>
              <VisitorButton onClick={() => nav(`/user/chat?target_id=${profile.id}`)}>
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
          <span>{isMine ? '我发过的帖子' : 'Ta发过的帖子'}</span>
          <span className="chevron">
            <DesignIcon name={expanded.posts ? 'chevronUp' : 'chevronDown'} size={22} />
          </span>
        </MenuItem>
        {expanded.posts ? (
          <ExpandedPanel>
            <ExpandedPosts id="profile-posts">
              {posts.length ? (
                posts.slice(0, 1).map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <MiniEmpty>{isMine ? '还没有发过帖子' : 'Ta还没有发过帖子'}</MiniEmpty>
              )}
              {posts.length ? (
                <ViewAll type="button" onClick={() => nav(`/user/${profile.id}`)}>
                  查看全部 &gt;
                </ViewAll>
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
          <span>{isMine ? '我的收藏' : 'Ta的收藏'}</span>
          <span className="chevron">
            <DesignIcon
              name={expanded.collections ? 'chevronUp' : 'chevronDown'}
              size={22}
            />
          </span>
        </MenuItem>
        {expanded.collections ? (
          <ExpandedPanel>
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
                {collectedPosts.length ? (
                  collectedPosts
                    .slice(0, 1)
                    .map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <MiniEmpty>{isMine ? '还没有收藏帖子' : 'Ta还没有收藏帖子'}</MiniEmpty>
                )}
                {collectedPosts.length ? (
                  <ViewAll type="button" onClick={() => nav(`/user/${profile.id}/collect`)}>
                    查看全部 &gt;
                  </ViewAll>
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
                {collectedRankings.length ? (
                  collectedRankings.slice(0, 1).map((item) => {
                    const ranking = item.sip_score || {};
                    return (
                      <RankingCard
                        key={ranking.id || ranking.name}
                        type="button"
                        onClick={() => ranking.id && nav(`/sip-score/${ranking.id}`)}
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
                  <MiniEmpty>{isMine ? '还没有收藏榜单' : 'Ta还没有收藏榜单'}</MiniEmpty>
                )}
                {collectedRankings.length ? (
                  <ViewAll
                    type="button"
                    onClick={() => nav(`/user/${profile.id}/collect?tab=sipScore`)}
                  >
                    查看全部 &gt;
                  </ViewAll>
                ) : null}
              </ExpandedPosts>
            ) : null}
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
              <span>退出与登录</span>
              <span />
            </MenuItem>
          </ActionGroup>
        ) : null}
      </Menu>
      {toast ? <CenterToast>{toast}</CenterToast> : null}
    </MobileShell>
  );
};

export default Profile;
