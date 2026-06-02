import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { mobileApi, MobilePost } from '../api';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';
import { TARGET_TYPE, TYPE_NAME, mobileTableByCategory } from '../constants';
import moment from 'utils/moment';
import MobileAvatar from './MobileAvatar';
import DesignIcon from './DesignIcon';

const stripHtml = (value?: string) =>
  (value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const Card = styled.article`
  width: calc(100% - 28px);
  margin: 0 auto 12px;
  padding: 15px 15px 13px;
  border: 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.985);
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.05);
  }
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: start;
  column-gap: 10px;
  color: #7f838a;
  font-size: 12px;
  .author {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${mobilePalette.ink};
    font-size: 15px;
    font-weight: 800;
    line-height: 1.25;
  }
  .time {
    display: inline-block;
    margin-top: 2px;
    color: #bfbfc0;
  }
  .dot {
    margin: 0 5px;
    color: rgba(127, 131, 138, 0.48);
  }
  .table {
    color: #c46c00;
    font-weight: 700;
  }
`;

const Title = styled.h2`
  margin: 12px 0 8px;
  display: -webkit-box;
  overflow: hidden;
  color: #1a202c;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const Summary = styled.p`
  min-height: 20px;
  margin: 0;
  display: -webkit-box;
  overflow: hidden;
  color: #1a202c;
  font-size: 13px;
  line-height: 1.62;
  word-break: break-word;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`;

const Footer = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 12px;
  color: #7f838a;
  font-size: 11px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  button,
  span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    min-height: 28px;
    padding: 0 2px;
    background: transparent;
    color: inherit;
    transition: transform ${mobileMotion.fast}, color ${mobileMotion.fast};
  }
  button:active {
    transform: scale(0.94);
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  overflow: visible;
  span {
    max-width: 100%;
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    border-radius: ${mobileRadius.pill};
    background: rgba(255, 198, 65, 0.16);
    color: #8a6410;
    font-size: 11px;
    line-height: 1.35;
    word-break: break-word;
  }
`;

const getSummary = (post: MobilePost) =>
  post.summary ||
  stripHtml(post.content) ||
  stripHtml(post.compiled_content) ||
  '暂无摘要';

const PostCard: React.FC<{ post: MobilePost }> = ({ post }) => {
  const nav = useNavigate();
  const [liked, setLiked] = useState(Boolean(post.is_liked));
  const [collected, setCollected] = useState(Boolean(post.is_collection));
  const [likeCount, setLikeCount] = useState(post.like_num || 0);
  const [collectionCount, setCollectionCount] = useState(post.collection_num || 0);
  const table = mobileTableByCategory(post.category);
  const postId =
    Number(post.id || (post as any).post_id || (post as any).article_id || 0) || 0;
  const openPost = () => {
    if (!postId) {
      message.warning('这个帖子暂时无法打开');
      return;
    }
    nav(`/article/${postId}`);
  };

  const toggleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!postId) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));
    const res = await mobileApi.like(postId, TYPE_NAME.post);
    if (res.code !== 0) {
      message.error(res.message || '操作失败');
      setLiked(!nextLiked);
      setLikeCount((count) => Math.max(0, count + (nextLiked ? -1 : 1)));
    }
  };

  const toggleCollect = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!postId) return;
    const nextCollected = !collected;
    setCollected(nextCollected);
    setCollectionCount((count) => Math.max(0, count + (nextCollected ? 1 : -1)));
    const res = await mobileApi.collection.toggle(postId, TARGET_TYPE.post);
    if (res.code !== 0) {
      message.error(res.message || '操作失败');
      setCollected(!nextCollected);
      setCollectionCount((count) => Math.max(0, count + (nextCollected ? -1 : 1)));
    }
  };

  const openComments = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!postId) return;
    nav(`/article/${postId}#mobile-comments`);
  };

  return (
    <Card onClick={openPost}>
      <Meta>
        <MobileAvatar url={post.creator_avatar} size={36} />
        <span>
          <span className="author">{post.creator_name || '茶友'}</span>
          <span className="time">
            {post.time ? moment(post.time).fromNow() : ''}
            <span className="dot">·</span>
            <span className="table">{table.name}</span>
          </span>
        </span>
      </Meta>
      <Title>{post.title || '未命名帖子'}</Title>
      <Summary>{getSummary(post)}</Summary>
      <Footer>
        <Tags>
          {(post.tags || []).slice(0, 2).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </Tags>
        <Stats>
          <button
            type="button"
            onClick={toggleLike}
            aria-label={liked ? '取消点赞' : '点赞'}
          >
            <DesignIcon
              name="like"
              size={14}
              color={liked ? mobilePalette.orange : undefined}
            />
            {likeCount}
          </button>
          <button type="button" onClick={openComments} aria-label="查看评论">
            <DesignIcon name="comment" size={14} />
            {post.comment_num || 0}
          </button>
          <button
            type="button"
            onClick={toggleCollect}
            aria-label={collected ? '取消收藏' : '收藏'}
          >
            <DesignIcon
              name="bookmark"
              size={13}
              color={collected ? mobilePalette.orange : undefined}
            />
            {collectionCount}
          </button>
        </Stats>
      </Footer>
    </Card>
  );
};

export default PostCard;
