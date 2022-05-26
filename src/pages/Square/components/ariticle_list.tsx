import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getDraftsList, Draft } from 'db/db';
import styled from 'styled-components';
import { w } from 'styles/global';

interface ItemProps {
  title: string;
  content: string;
  onClick: () => void;
}

const Item = styled.li`
  margin: 0.5em;
  border-bottom: 0.5px solid #ebeaea;
  padding-bottom: 0.5em;
  min-height: 8vh;
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

const ArticleItem: React.FC<ItemProps> = ({ onClick, title, content }) => {
  return (
    <Item onClick={onClick}>
      <h5>{title}</h5>
      <div> {content} </div>
    </Item>
  );
};

const ArticleList: React.FC = () => {
  const [list, setList] = useState<Draft[]>([]);

  const nav = useNavigate();

  const handleToArticleDtl = (article_id: string) => {
    nav(`${article_id}`);
  };

  useEffect(() => {
    getDraftsList().then((list) => {
      setList(list);
    });
  }, []);
  return (
    <ItemWrapper>
      {list.map((article) => (
        <ArticleItem
          onClick={() => handleToArticleDtl(article.id)}
          key={article.id}
          title={article.title}
          content={article.content}
        />
      ))}
    </ItemWrapper>
  );
};

export default ArticleList;
