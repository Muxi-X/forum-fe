import React from 'react';
import styled from 'styled-components';
import { MessageOutlined, StarOutlined, LikeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MobilePost } from '../api';
import { mobilePalette, CardSurface } from '../styles';
import { mobileTableByCategory } from '../constants';
import moment from 'utils/moment';

const Card = styled(CardSurface)`
  padding: 14px 14px 12px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f1f4;
`;

const Title = styled.h2`
  margin: 10px 0 6px;
  font-size: 17px;
  line-height: 1.35;
  font-weight: 800;
  color: ${mobilePalette.ink};
`;

const Summary = styled.p`
  margin: 0;
  color: #5f6671;
  line-height: 1.6;
  word-break: break-word;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const Stats = styled.div`
  display: flex;
  gap: 12px;
  .anticon {
    margin-right: 4px;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  span {
    height: 24px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    border-radius: 999px;
    background: #fff5d7;
    color: #805b00;
    font-size: 12px;
  }
`;

const PostCard: React.FC<{ post: MobilePost }> = ({ post }) => {
  const nav = useNavigate();
  const table = mobileTableByCategory(post.category);
  return (
    <Card onClick={() => post.id && nav(`/article/${post.id}`)}>
      <Meta>
        <Avatar
          src={post.creator_avatar || 'https://ossforum.muxixyz.com/default/avatar.png'}
        />
        <span>{post.creator_name || '茶友'}</span>
        <span>{post.time ? moment(post.time).fromNow() : ''}</span>
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
        <span>{table.name}</span>
        <Stats>
          <span>
            <LikeOutlined />
            {post.like_num || 0}
          </span>
          <span>
            <MessageOutlined />
            {post.comment_num || 0}
          </span>
          <span>
            <StarOutlined />
            {post.collection_num || 0}
          </span>
        </Stats>
      </Footer>
    </Card>
  );
};

export default PostCard;
