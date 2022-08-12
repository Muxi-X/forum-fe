import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LikeOutlined, HeartOutlined } from '@ant-design/icons';
import useList from 'store/useList';
import { CATEGORY } from 'config';
import Tag from 'components/Tag/tag';

import { Item, ItemWrapper, Content, Title, Info } from './style';

interface ItemProps {
  title: string;
  content: string;
  onClick: () => void;
  popularity: number;
  likes: number;
  time: string;
  tid: number;
}

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
        {title} <Tag tag={CATEGORY[tid]} />
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
    // Service.getAllList().then((res: any) => {
    //   list.setList(res.list);
    // });
  }, []);

  return (
    <ItemWrapper>
      {list.postList.map((article: any, id: any) => (
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
