import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StarOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import { CardSurface, mobilePalette } from '../styles';
import { mobileApi, MobilePost, SipScoreWithEntries } from '../api';

const List = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
`;

const RankingCard = styled(CardSurface)`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 12px;
`;

const Cover = styled.div<{ src?: string }>`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: ${(props) =>
    props.src
      ? `url(${props.src}) center/cover`
      : 'linear-gradient(135deg, #ffe8a8, #8bc6a4)'};
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
  }
  .meta {
    margin-top: 8px;
    color: ${mobilePalette.orange};
    font-size: 12px;
  }
`;

const Collection: React.FC = () => {
  const { user_id } = useParams();
  const userId = Number(user_id);
  const nav = useNavigate();
  const [tab, setTab] = useState('post');
  const [posts, setPosts] = useState<MobilePost[]>([]);
  const [rankings, setRankings] = useState<SipScoreWithEntries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const request =
      tab === 'post'
        ? mobileApi.collection.list(userId, { limit: 30, page: 0 })
        : mobileApi.sipScore.collected(userId, { limit: 30, page: 0 });

    request
      .then((res) => {
        if (res.code === 20103) {
          message.warning('对方打开了隐私权限哦');
          setPosts([]);
          setRankings([]);
          return;
        }
        if (res.code !== 0) {
          message.error(res.message || '加载失败');
          return;
        }
        if (tab === 'post') {
          setPosts(('posts' in res.data ? res.data.posts : []) || []);
        } else {
          setRankings(('sip_scores' in res.data ? res.data.sip_scores : []) || []);
        }
      })
      .finally(() => setLoading(false));
  }, [tab, userId]);

  return (
    <MobileShell title="我的收藏" back tabs={false}>
      <SegmentTabs
        value={tab}
        items={[
          { label: '帖子', value: 'post' },
          { label: '榜单', value: 'sipScore' },
        ]}
        onChange={(value) => setTab(String(value))}
      />
      {loading ? (
        <EmptyState text="加载中..." />
      ) : tab === 'post' ? (
        posts.length ? (
          <List>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </List>
        ) : (
          <EmptyState text="还没有收藏帖子" />
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
                <Cover src={ranking?.cover_img} />
                <RankingInfo>
                  <h3>{ranking?.name || '未命名榜单'}</h3>
                  <p>{ranking?.description || '暂无简介'}</p>
                  <div className="meta">
                    <StarOutlined /> {ranking?.collect_count || 0} 收藏 ·{' '}
                    {ranking?.entry_count || item.entries?.length || 0} 个对象
                  </div>
                </RankingInfo>
              </RankingCard>
            );
          })}
        </List>
      ) : (
        <EmptyState text="还没有收藏榜单" />
      )}
    </MobileShell>
  );
};

export default Collection;
