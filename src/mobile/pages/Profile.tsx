import React, { useEffect, useState } from 'react';
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
import { mastergoAssets } from '../assets/mastergo';
import { clearAuthStorage } from '../../utils/auth';
import {
  applyPostStatPatch,
  applyStoredPostStatPatches,
  MOBILE_POST_STAT_EVENT,
  MobilePostStatPatch,
} from '../postEvents';

type ProfileCacheState = {
  profile: MobileUser;
  posts: MobilePost[];
  collectedPosts: MobilePost[];
  collectedRankings: SipScoreWithEntries[];
  currentUserId: number;
};

const profileCache = new Map<number, ProfileCacheState>();

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
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMine = Boolean(
    !userId ||
      (currentUserId && userId === currentUserId) ||
      (profile?.id && currentUserId && profile.id === currentUserId),
  );

  const load = async (options?: { force?: boolean }) => {
    const targetBeforeResolve = userId || currentUserId;
    const cached =
      !options?.force && targetBeforeResolve
        ? profileCache.get(targetBeforeResolve)
        : undefined;
    if (cached) {
      setProfile(cached.profile);
      const cachedPosts = applyStoredPostStatPatches(cached.posts);
      const cachedCollectedPosts = applyStoredPostStatPatches(cached.collectedPosts);
      cached.posts = cachedPosts;
      cached.collectedPosts = cachedCollectedPosts;
      setPosts(cachedPosts);
      setCollectedPosts(cachedCollectedPosts);
      setCollectedRankings(cached.collectedRankings);
      setCurrentUserId(cached.currentUserId);
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
      if (profileRes.code === 0) nextProfile = profileRes.data;
      else setError(profileRes.message || '资料加载失败');
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
    const [postsRes, collectedPostsRes, collectedRankingsRes] = await Promise.allSettled([
      mobileApi.posts.published(effectiveId, { limit: 10 }),
      mobileApi.collection.list(effectiveId, { limit: 3, page: 0 }),
      mobileApi.sipScore.collected(effectiveId, { limit: 3, page: 0 }),
    ]);
    const nextPosts =
      postsRes.status === 'fulfilled' && postsRes.value.code === 0
        ? applyStoredPostStatPatches(postsRes.value.data.posts || [])
        : [];
    const nextCollectedPosts =
      collectedPostsRes.status === 'fulfilled' && collectedPostsRes.value.code === 0
        ? applyStoredPostStatPatches(collectedPostsRes.value.data.posts || [])
        : [];
    const nextCollectedRankings =
      collectedRankingsRes.status === 'fulfilled' && collectedRankingsRes.value.code === 0
        ? collectedRankingsRes.value.data.sip_scores || []
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
    profileCache.set(Number(effectiveId), {
      profile: effectiveProfile,
      posts: nextPosts,
      collectedPosts: nextCollectedPosts,
      collectedRankings: nextCollectedRankings,
      currentUserId: resolvedCurrentUserId,
    });
    setLoading(false);
  };

  useEffect(() => {
    if ((state as any)?.refreshProfile) {
      refreshProfile();
      nav(`/user/${userId || currentUserId || ''}`, { replace: true, state: null });
      return;
    }
    load();
  }, [userId, currentUserId, (state as any)?.refreshProfile]);

  useEffect(() => {
    const handlePostPatch = (event: Event) => {
      const patch = (event as CustomEvent<MobilePostStatPatch>).detail;
      if (!patch?.id) return;
      setPosts((current) => current.map((post) => applyPostStatPatch(post, patch)));
      setCollectedPosts((current) =>
        current.map((post) => applyPostStatPatch(post, patch)),
      );
      profileCache.forEach((cache) => {
        cache.posts = cache.posts.map((post) => applyPostStatPatch(post, patch));
        cache.collectedPosts = cache.collectedPosts.map((post) =>
          applyPostStatPatch(post, patch),
        );
      });
    };
    window.addEventListener(MOBILE_POST_STAT_EVENT, handlePostPatch);
    return () => window.removeEventListener(MOBILE_POST_STAT_EVENT, handlePostPatch);
  }, []);

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
    clearAuthStorage();
    nav('/login');
  };

  const refreshProfile = async () => {
    const target = profile?.id || userId || currentUserId;
    if (target) profileCache.delete(Number(target));
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
          <HeroActions>
            {isMine ? (
              <TitleIconButton
                type="button"
                onClick={() => nav('/notice')}
                aria-label="消息"
              >
                <DesignIcon name="bell" size={23} />
              </TitleIconButton>
            ) : (
              <TitleIconButton type="button" aria-label="更多">
                <DesignIcon name="more" size={23} />
              </TitleIconButton>
            )}
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
                onClick={() => message.info('关注列表暂未开放')}
                aria-label="查看关注列表"
              >
                <strong>{profile.following_count || 0}</strong>关注
              </button>
              <button
                type="button"
                onClick={() => message.info('粉丝列表暂未开放')}
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
                {posts.length ? (
                  posts
                    .slice(0, 1)
                    .map((post) => (
                      <PostCard key={post.id} post={post} variant="compactOwn" />
                    ))
                ) : (
                  <MiniEmpty>{isMine ? '还没有发过帖子' : 'Ta 还没有发过帖子'}</MiniEmpty>
                )}
                {posts.length > 1 ? (
                  <ViewAllButton
                    type="button"
                    onClick={() => nav(profileListPath(profileId, 'published'))}
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
            <span>{isMine ? '我的收藏' : '公开收藏'}</span>
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
                    <MiniEmpty>
                      {isMine ? '还没有收藏帖子' : 'Ta 还没有收藏帖子'}
                    </MiniEmpty>
                  )}
                  {collectedPosts.length > 1 ? (
                    <ViewAllButton
                      type="button"
                      onClick={() => nav(profileListPath(profileId, 'post'))}
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
                    <MiniEmpty>
                      {isMine ? '还没有收藏榜单' : 'Ta 还没有收藏榜单'}
                    </MiniEmpty>
                  )}
                  {collectedRankings.length > 1 ? (
                    <ViewAllButton
                      type="button"
                      onClick={() => nav(profileListPath(profileId, 'sipScore'))}
                    >
                      <span>查看全部收藏榜单</span>
                      <DesignIcon name="chevronRight" size={18} />
                    </ViewAllButton>
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
