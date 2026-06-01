import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MobilePost } from '../api';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';
import { mobileTableByCategory } from '../constants';
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: #7f838a;
  font-size: 11px;
`;

const Stats = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 12px;
  span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
`;

const Tags = styled.div`
  display: flex;
  min-width: 0;
  gap: 6px;
  overflow: hidden;
  span {
    max-width: 88px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    overflow: hidden;
    border-radius: ${mobileRadius.pill};
    background: rgba(255, 198, 65, 0.16);
    color: #8a6410;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const getSummary = (post: MobilePost) =>
  post.summary ||
  stripHtml(post.content) ||
  stripHtml(post.compiled_content) ||
  '暂无摘要';

const PostCard: React.FC<{ post: MobilePost }> = ({ post }) => {
  const nav = useNavigate();
  const table = mobileTableByCategory(post.category);
  return (
    <Card onClick={() => post.id && nav(`/article/${post.id}`)}>
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
          <span>
            <DesignIcon name="like" size={14} />
            {post.like_num || 0}
          </span>
          <span>
            <DesignIcon name="comment" size={14} />
            {post.comment_num || 0}
          </span>
          <span>
            <DesignIcon name="bookmark" size={13} />
            {post.collection_num || 0}
          </span>
        </Stats>
      </Footer>
    </Card>
  );
};

export default PostCard;
