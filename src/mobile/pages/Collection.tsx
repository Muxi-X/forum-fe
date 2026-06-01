import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import MobileImage from '../components/MobileImage';
import DesignIcon from '../components/DesignIcon';
import { CardSurface, mobilePalette } from '../styles';
import { mobileApi, MobilePost, SipScoreWithEntries } from '../api';

const List = styled.div`
  display: grid;
  gap: 10px;
  padding: 0 0 20px;
  background: #fff;
`;

const RankingCard = styled(CardSurface)`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 12px;
  border: 0;
  border-bottom: 1px solid #efefef;
  border-radius: 0;
`;

const Cover = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 8px;
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
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'post';
  const normalizeTab = (value: string) => (value === 'posts' ? 'post' : value);
  const [tab, setTab] = useState(
    ['published', 'post', 'posts', 'sipScore'].includes(initialTab)
      ? normalizeTab(initialTab)
      : 'post',
  );
  const [posts, setPosts] = useState<MobilePost[]>([]);
  const [rankings, setRankings] = useState<SipScoreWithEntries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    const request =
      tab === 'published'
        ? mobileApi.posts.published(userId, { limit: 30, page: 0 })
        : tab === 'post'
        ? mobileApi.collection.list(userId, { limit: 30, page: 0 })
        : mobileApi.sipScore.collected(userId, { limit: 30, page: 0 });

    request
      .then((res) => {
        if (res.code === 20103) {
          setError('对方打开了隐私权限哦');
          setPosts([]);
          setRankings([]);
          return;
        }
        if (res.code !== 0) {
          setError(res.message || '加载失败');
          message.error(res.message || '加载失败');
          return;
        }
        if (tab === 'published' || tab === 'post') {
          setPosts(('posts' in res.data ? res.data.posts : []) || []);
        } else {
          setRankings(('sip_scores' in res.data ? res.data.sip_scores : []) || []);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '加载失败');
      })
      .finally(() => setLoading(false));
  }, [tab, userId]);

  return (
    <MobileShell title={tab === 'published' ? '发布的帖子' : '收藏'} back tabs={false}>
      <SegmentTabs
        value={tab}
        items={[
          { label: '发布', value: 'published' },
          { label: '收藏帖子', value: 'post' },
          { label: '收藏榜单', value: 'sipScore' },
        ]}
        onChange={(value) => setTab(String(value))}
      />
      {loading ? (
        <LoadingState text="正在读取收藏..." />
      ) : error ? (
        <ErrorState text={error} />
      ) : tab === 'published' || tab === 'post' ? (
        posts.length ? (
          <List>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </List>
        ) : (
          <EmptyState title={tab === 'published' ? '还没有发过帖子' : '还没有收藏帖子'} />
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
                  <MobileImage src={ranking?.cover_img} fallbackText="榜单" radius={8} />
                </Cover>
                <RankingInfo>
                  <h3>{ranking?.name || '未命名榜单'}</h3>
                  <p>{ranking?.description || '暂无简介'}</p>
                  <div className="meta">
                    <DesignIcon name="bookmark" size={13} color={mobilePalette.orange} />{' '}
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
    </MobileShell>
  );
};

export default Collection;
