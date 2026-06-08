import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { mobileApi, MobilePost } from '../api';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';
import { TARGET_TYPE, TYPE_NAME, mobileTableByCategory } from '../constants';
import moment from 'utils/moment';
import MobileAvatar from './MobileAvatar';
import DesignIcon from './DesignIcon';
import {
  emitPostStatPatch,
  MOBILE_POST_STAT_EVENT,
  MobilePostStatPatch,
} from '../postEvents';
import { sendPostInteractionNotification } from '../notifications';

const stripHtml = (value?: string) =>
  (value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const Card = styled.article<{ $pressed: boolean; $compact?: boolean }>`
  width: calc(100% - 28px);
  margin: 0 auto 12px;
  padding: 15px 15px 13px;
  border: 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
  cursor: pointer;
  transform: ${(props) => (props.$pressed ? 'scale(0.985)' : 'scale(1)')};
  transition: transform ${mobileMotion.fast}, box-shadow ${mobileMotion.fast};
  box-shadow: ${(props) =>
    props.$pressed
      ? '0 6px 18px rgba(16, 24, 40, 0.05)'
      : '0 10px 28px rgba(16, 24, 40, 0.06)'};
  ${(props) =>
    props.$compact
      ? `
    width: 100%;
    margin-bottom: 8px;
    padding: 14px;
    h2 {
      margin-top: 0;
    }
  `
      : ''}
`;

const Meta = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: start;
  column-gap: 10px;
  padding: 0;
  background: transparent;
  color: #7f838a;
  font-size: 12px;
  text-align: left;
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

const CompactMeta = styled.div`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: start;
  column-gap: 10px;
  margin: 0 0 8px;
  color: ${mobilePalette.muted};
  font-size: 12px;
  .text {
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  button {
    min-width: 0;
    display: block;
    padding: 0;
    background: transparent;
    color: ${mobilePalette.ink};
    font-size: 15px;
    font-weight: 800;
    line-height: 1.25;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sub {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    overflow: hidden;
    white-space: nowrap;
  }
  .time {
    flex: 0 1 auto;
    min-width: max-content;
  }
  .dot {
    flex: 0 0 auto;
    color: rgba(127, 131, 138, 0.48);
  }
  .table {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #c46c00;
    font-weight: 700;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
  color: #7f838a;
  font-size: 11px;
`;

const Stats = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  span {
    cursor: default;
  }
  button:active {
    transform: scale(0.94);
  }
`;

const isCardActionTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(target.closest('[data-post-stat], [data-post-author]'));

const Tags = styled.div`
  flex: 1 1 auto;
  min-width: 0;
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

const resolvePostId = (post: MobilePost) => Number(post.id || 0) || 0;

const getSummary = (post: MobilePost) =>
  post.summary ||
  stripHtml(post.content) ||
  stripHtml(post.compiled_content) ||
  '暂无摘要';

const PostCard: React.FC<{ post: MobilePost; variant?: 'default' | 'compactOwn' }> = ({
  post,
  variant = 'default',
}) => {
  const nav = useNavigate();
  const [pressed, setPressed] = useState(false);
  const [liked, setLiked] = useState(Boolean(post.is_liked));
  const [collected, setCollected] = useState(Boolean(post.is_collection));
  const [likeCount, setLikeCount] = useState(post.like_num || 0);
  const [collectionCount, setCollectionCount] = useState(post.collection_num || 0);
  const table = mobileTableByCategory(post.category);
  const postId = resolvePostId(post);
  const compactOwn = variant === 'compactOwn';

  useEffect(() => {
    setLiked(Boolean(post.is_liked));
    setCollected(Boolean(post.is_collection));
    setLikeCount(post.like_num || 0);
    setCollectionCount(post.collection_num || 0);
  }, [post.is_liked, post.is_collection, post.like_num, post.collection_num]);

  useEffect(() => {
    if (!postId) return undefined;
    const handlePatch = (event: Event) => {
      const patch = (event as CustomEvent<MobilePostStatPatch>).detail;
      if (!patch?.id || Number(patch.id) !== Number(postId)) return;
      if (patch.is_liked !== undefined) setLiked(Boolean(patch.is_liked));
      if (patch.like_num !== undefined) setLikeCount(patch.like_num || 0);
      if (patch.is_collection !== undefined) setCollected(Boolean(patch.is_collection));
      if (patch.collection_num !== undefined) {
        setCollectionCount(patch.collection_num || 0);
      }
    };
    window.addEventListener(MOBILE_POST_STAT_EVENT, handlePatch);
    return () => window.removeEventListener(MOBILE_POST_STAT_EVENT, handlePatch);
  }, [postId]);
  const openPost = () => {
    if (!postId) {
      message.warning('这个帖子暂时无法打开');
      return;
    }
    nav(`/article/${postId}`);
  };

  const handleOpenPost = (event: React.MouseEvent<HTMLElement>) => {
    if (isCardActionTarget(event.target)) return;
    openPost();
  };

  const openAuthor = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (post.creator_id) nav(`/user/${post.creator_id}`);
  };

  const toggleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!postId) return;
    if (!localStorage.getItem('token')) {
      nav('/login');
      return;
    }
    const nextLiked = !liked;
    const nextCount = Math.max(0, likeCount + (nextLiked ? 1 : -1));
    setLiked(nextLiked);
    setLikeCount(nextCount);
    emitPostStatPatch({ id: postId, is_liked: nextLiked, like_num: nextCount });
    const res = await mobileApi.like(postId, TYPE_NAME.post);
    if (res.code !== 0) {
      message.error(res.message || '操作失败');
      setLiked(!nextLiked);
      const revertedCount = Math.max(0, nextCount + (nextLiked ? -1 : 1));
      setLikeCount(revertedCount);
      emitPostStatPatch({
        id: postId,
        is_liked: !nextLiked,
        like_num: revertedCount,
      });
    } else if (nextLiked) {
      sendPostInteractionNotification(post, 'like');
    }
  };

  const toggleCollect = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!postId) return;
    if (!localStorage.getItem('token')) {
      nav('/login');
      return;
    }
    const nextCollected = !collected;
    const nextCount = Math.max(0, collectionCount + (nextCollected ? 1 : -1));
    setCollected(nextCollected);
    setCollectionCount(nextCount);
    emitPostStatPatch({
      id: postId,
      is_collection: nextCollected,
      collected_at: nextCollected ? Date.now() : 0,
      collection_num: nextCount,
    });
    const res = await mobileApi.collection.toggle(postId, TARGET_TYPE.post);
    if (res.code !== 0) {
      message.error(res.message || '操作失败');
      setCollected(!nextCollected);
      const revertedCount = Math.max(0, nextCount + (nextCollected ? -1 : 1));
      setCollectionCount(revertedCount);
      emitPostStatPatch({
        id: postId,
        is_collection: !nextCollected,
        collected_at: !nextCollected ? Date.now() : 0,
        collection_num: revertedCount,
      });
    } else if (nextCollected) {
      sendPostInteractionNotification(post, 'collection');
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (isCardActionTarget(event.target)) return;
    setPressed(true);
  };

  const resetPressed = () => {
    setPressed(false);
  };

  return (
    <Card
      $pressed={pressed}
      $compact={compactOwn}
      role="button"
      tabIndex={0}
      onClick={handleOpenPost}
      onPointerDown={handlePointerDown}
      onPointerUp={resetPressed}
      onPointerCancel={resetPressed}
      onPointerLeave={resetPressed}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPost();
        }
      }}
    >
      {compactOwn ? (
        <>
          <CompactMeta>
            <MobileAvatar url={post.creator_avatar} size={36} />
            <span className="text">
              <button
                type="button"
                data-post-author
                onClick={openAuthor}
                aria-label={`查看 ${post.creator_name || '茶友'} 的主页`}
              >
                {post.creator_name || '茶友'}
              </button>
              <span className="sub">
                {post.time ? (
                  <span className="time">{moment(post.time).fromNow()}</span>
                ) : null}
                {post.time ? <span className="dot">·</span> : null}
                <span className="table">{table.name}</span>
              </span>
            </span>
          </CompactMeta>
          <Title>{post.title || '未命名帖子'}</Title>
        </>
      ) : (
        <>
          <Meta
            type="button"
            data-post-author
            onClick={openAuthor}
            aria-label={`查看 ${post.creator_name || '茶友'} 的主页`}
          >
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
        </>
      )}
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
            data-post-stat
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
          <span data-post-stat aria-label="评论数">
            <DesignIcon name="comment" size={14} />
            {post.comment_num || 0}
          </span>
          <button
            type="button"
            data-post-stat
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
