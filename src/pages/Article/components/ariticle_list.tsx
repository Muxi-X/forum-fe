import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LikeOutlined, HeartOutlined } from '@ant-design/icons';
import useList from 'store/useList';
import styled from 'styled-components';
import { w } from 'styles/global';
import Tag from 'components/Tag/tag';
import Service from 'service/fetch';

interface ItemProps {
  title: string;
  content: string;
  onClick: () => void;
  popularity: number;
  likes: number;
  time: string;
  tid: number;
}

interface ListProps {
  Taglist: any;
}
const tags = ['运动', '交友', '摄影', '动漫', '游戏', '校园', '生活', '美食', '科技'];

const Item = styled.li`
  margin: 0.5em;
  height: 8em;
  border-bottom: 1.5px solid #ebeaea;
  :hover {
    background-color: #f8f8f8;
    cursor: pointer;
  }
`;
const ItemWrapper = styled.ul`
  padding: 1em;
  list-style: none;
  min-height: 90vh;
  ${w}
`;

const Content = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  max-height: 2.8em;
  min-height: 2em;
  line-height: 1.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 0.2em;
    height: 1em;
    border-radius: 999px;
    margin-right: 0.5em;
    background-color: rgb(5, 156, 243);
  }
`;

const Info = styled.div`
  font-size: 1em;
  color: gray;
  display: flex;
  justify-content: space-around;

  span {
    width: fit-content;
    min-width: 3em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const ArticleItem: React.FC<ItemProps> = ({
  onClick,
  title,
  content,
  popularity,
  likes,
  time,
  tid,
}) => {
  return (
    <Item onClick={onClick}>
      <Title>
        {title} <Tag tag={tags[tid]} />
      </Title>
      <Content>{content}</Content>
      <Info>
        <span>
          <HeartOutlined style={{ color: 'gray' }} />
          {popularity}
        </span>
        <span>
          <LikeOutlined style={{ color: 'gray' }} />
          {likes}
        </span>
        <span>{time}</span>
      </Info>
    </Item>
  );
};

const ArticleList: React.FC = () => {
  const list = useList();
  const nav = useNavigate();

  const handleToArticleDtl = (article_id: string) => {
    nav(`/article/${article_id}`);
  };

  useEffect(() => {
    Service.getAllList().then((res: any) => {
      list.setList(res.list);
    });
  }, []);

  return (
    <ItemWrapper>
      {list.list.map((article: any, id: any) => (
        <ArticleItem
          onClick={() => handleToArticleDtl(article.aid)}
          key={id}
          title={article.title}
          content={article.content}
          popularity={article.popularity}
          likes={article.likes}
          time={article.time}
          tid={article.tid}
        />
      ))}
    </ItemWrapper>
  );
};

export default ArticleList;
