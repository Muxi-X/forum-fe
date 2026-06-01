import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  EditOutlined,
  LogoutOutlined,
  MessageOutlined,
  StarOutlined,
  FileTextOutlined,
  FormOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import MobileShell from '../components/MobileShell';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import { mobilePalette, Section, PrimaryButton, GhostButton } from '../styles';
import { mobileApi, MobilePost, MobileUser, SipScoreWithEntries } from '../api';

const Hero = styled.section`
  position: relative;
  padding: 94px 16px 16px;
  background: radial-gradient(
      circle at 18px 28px,
      rgba(255, 255, 255, 0.55) 0 9px,
      transparent 10px
    ),
    radial-gradient(circle at 66px 48px, rgba(255, 255, 255, 0.36) 0 8px, transparent 9px),
    linear-gradient(180deg, #ffd57b 0%, #fff1bd 62%, #fffefa 63%);
`;

const NoticeIcon = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.64);
`;

const Avatar = styled.img`
  width: 94px;
  height: 94px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 8px 20px rgba(39, 45, 55, 0.12);
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  h1 {
    margin: 0;
    font-size: 23px;
    font-weight: 900;
  }
`;

const Signature = styled.p`
  margin: 8px 0 12px;
  color: ${mobilePalette.muted};
`;

const Counts = styled.div`
  display: flex;
  gap: 28px;
  color: ${mobilePalette.muted};
  strong {
    display: block;
    color: ${mobilePalette.ink};
    font-size: 17px;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
`;

const Menu = styled(Section)`
  margin-top: 10px;
`;

const MenuItem = styled.button`
  width: 100%;
  height: 58px;
  display: grid;
  grid-template-columns: 38px 1fr 24px;
  align-items: center;
  padding: 0 16px;
  background: transparent;
  border-bottom: 1px solid ${mobilePalette.line};
  text-align: left;
  color: ${mobilePalette.ink};
  .anticon:first-child {
    color: ${mobilePalette.orange};
    font-size: 19px;
  }
  &:last-child {
    border-bottom: 0;
  }
`;

const List = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
`;

const RankingCard = styled.button`
  width: 100%;
  display: block;
  padding: 14px;
  background: ${mobilePalette.paper};
  border: 1px solid ${mobilePalette.line};
  border-radius: 8px;
  text-align: left;
  h3 {
    margin: 0 0 6px;
    font-size: 16px;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
  }
`;

const Profile: React.FC = () => {
  const { user_id } = useParams();
  const userId = Number(user_id);
  const nav = useNavigate();
  const myId = Number(localStorage.getItem('userId')) || 0;
  const isMine = userId === myId || !userId;
  const [profile, setProfile] = useState<MobileUser | null>(null);
  const [posts, setPosts] = useState<MobilePost[]>([]);
  const [rankings, setRankings] = useState<SipScoreWithEntries[]>([]);

  const load = async () => {
    const target = userId || myId;
    if (!target) return;
    const [profileRes, postsRes, rankingsRes] = await Promise.all([
      mobileApi.user.profile(target),
      mobileApi.posts.published(target, { limit: 10 }),
      mobileApi.sipScore.created(target, { limit: 10 }),
    ]);
    if (profileRes.code === 0) setProfile(profileRes.data);
    if (postsRes.code === 0) setPosts(postsRes.data.posts || []);
    if (rankingsRes.code === 0) setRankings(rankingsRes.data.sip_scores || []);
  };

  useEffect(() => {
    load();
  }, [userId, myId]);

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
      right="notice"
      onRight={() => nav('/notice')}
    >
      <Hero>
        <NoticeIcon onClick={() => nav('/notice')}>
          <MessageOutlined />
        </NoticeIcon>
        <Avatar
          src={profile.avatar || 'https://ossforum.muxixyz.com/default/avatar.png'}
        />
        <NameRow>
          <h1>{profile.name || '茶友'}</h1>
          {isMine ? (
            <EditOutlined onClick={() => nav(`/user/${profile.id}/seting`)} />
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
            <PrimaryButton onClick={follow}>
              {profile.is_following ? '已关注' : '关注'}
            </PrimaryButton>
            <GhostButton onClick={() => nav(`/user/chat?target_id=${profile.id}`)}>
              私信
            </GhostButton>
          </ActionBar>
        ) : null}
      </Hero>
      <Menu>
        <MenuItem
          onClick={() => document.getElementById('profile-posts')?.scrollIntoView()}
        >
          <FileTextOutlined />
          <span>我发过的帖子</span>
          <RightOutlined />
        </MenuItem>
        <MenuItem onClick={() => nav(`/user/${profile.id}/collect`)}>
          <StarOutlined />
          <span>我的收藏</span>
          <RightOutlined />
        </MenuItem>
        {isMine ? (
          <>
            <MenuItem onClick={() => nav('/feedback')}>
              <FormOutlined />
              <span>反馈与建议</span>
              <RightOutlined />
            </MenuItem>
            <MenuItem onClick={logout}>
              <LogoutOutlined />
              <span>退出与登录</span>
              <RightOutlined />
            </MenuItem>
          </>
        ) : null}
      </Menu>
      <List id="profile-posts">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </List>
      <List>
        {rankings.map((ranking) => (
          <RankingCard
            key={ranking.sip_score?.id}
            onClick={() => nav(`/sip-score/${ranking.sip_score?.id}`)}
          >
            <h3>{ranking.sip_score?.name}</h3>
            <p>{ranking.sip_score?.description}</p>
          </RankingCard>
        ))}
      </List>
    </MobileShell>
  );
};

export default Profile;
