import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MobilePost } from '../api';
import { CardSurface } from '../styles';
import { mobileTableByCategory } from '../constants';
import moment from 'utils/moment';
import MobileAvatar from './MobileAvatar';
import DesignIcon from './DesignIcon';

const Card = styled(CardSurface)`
  padding: 12px 20px 9px;
  border: 0;
  border-radius: 0;
  background: #fff;
  border-bottom: 1px solid #efefef;
  box-shadow: none;
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr;
  align-items: start;
  column-gap: 10px;
  color: #7f838a;
  font-size: 12px;
  .name {
    display: block;
    color: #1a202c;
    font-size: 19px;
    font-weight: 700;
    line-height: 1.25;
  }
  .time {
    display: inline-block;
    margin-top: 2px;
    color: #bfbfc0;
  }
  .creator {
    display: inline-block;
    margin-left: 12px;
    color: #fe9800;
  }
`;

const Title = styled.h2`
  margin: 12px 0 8px;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 700;
  color: #1a202c;
`;

const Summary = styled.p`
  margin: 0;
  color: #7f838a;
  line-height: 1.52;
  font-size: 13px;
  word-break: break-word;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  color: #7f838a;
  font-size: 11px;
`;

const Stats = styled.div`
  display: flex;
  gap: 14px;
  span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  display: none;
  margin-top: 10px;
  span {
    height: 24px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    border-radius: 8px;
    background: rgba(255, 211, 107, 0.2);
    color: #795548;
    font-size: 12px;
  }
`;

const PostCard: React.FC<{ post: MobilePost }> = ({ post }) => {
  const nav = useNavigate();
  const table = mobileTableByCategory(post.category);
  return (
    <Card onClick={() => post.id && nav(`/article/${post.id}`)}>
      <Meta>
        <MobileAvatar url={post.creator_avatar} size={36} />
        <span>
          <span className="name">{table.name}</span>
          <span className="time">{post.time ? moment(post.time).fromNow() : ''}</span>
          <span className="creator">{post.creator_name || '茶友'}</span>
        </span>
      </Meta>
      <Title>{post.title || '未命名帖子'}</Title>
      <Summary>
        {post.summary || post.content?.replace(/<[^>]+>/g, '').slice(0, 90)}
      </Summary>
      {post.tags?.length ? (
        <Tags>
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </Tags>
      ) : null}
      <Footer>
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
