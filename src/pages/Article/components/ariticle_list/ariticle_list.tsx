import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LikeOutlined, HeartOutlined } from '@ant-design/icons';
import useList from 'store/useList';
import { CATEGORY } from 'config';
import Tag from 'components/Tag/tag';

import { Item, ItemWrapper, Content, Title, Info } from './style';

interface ItemProps extends Required<defs.post_Post> {
  onClick: () => void;
}

export const ArticleItem: React.FC<ItemProps> = ({
  onClick,
  title,
  category,
  content,
}) => {
  return (
    <Item onClick={onClick}>
      <Title>
        {title} <Tag tag={CATEGORY[+category]} />
      </Title>
      <Content>{content}</Content>
      <Info>
        <span>
          <HeartOutlined style={{ color: 'gray' }} />
        </span>
        <span>
          <LikeOutlined style={{ color: 'gray' }} />
        </span>
        <span>time</span>
      </Info>
    </Item>
  );
};

const ArticleList: React.FC = () => {
  const listStore = useList();
  const nav = useNavigate();

  const handleToArticleDtl = (article_id: number) => {
    nav(`/article/${article_id}`);
  };

  useEffect(() => {
    // Service.getAllList().then((res: any) => {
    //   list.setList(res.list);
    // });
  }, []);

  return (
    <ItemWrapper>
      {listStore.postList.map((article) => (
        <ArticleItem
          onClick={() => {
            handleToArticleDtl(article.id as number);
          }}
          key={article.id}
          {...(article as Required<defs.post_Post>)}
        />
      ))}
    </ItemWrapper>
  );
};

export default ArticleList;
