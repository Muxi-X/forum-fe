import React from 'react';
import styled from 'styled-components';
import { useOutlet } from 'react-router';
import ArticleList from './Article/components/ariticle_list';
import Card from 'components/Card/card';
import Banner from 'components/Banner/banner';
import Tag from 'components/Tag/tag';
import { CATEGORY } from 'config';
import Service from 'service/fetch';
import useList from 'store/useList';

const Tags = styled.section`
  width: 100vw;
  height: 5vh;
`;

const Square: React.FC = () => {
  const list = useList();
  const handleListByTag = (tid: number) => {
    Service.getListByTag(tid).then((res: any) => {
      list.setList(res.list);
    });
  };
  return (
    <>
      <Banner />
      <Card>
        <Tags>
          {CATEGORY.map((t, id) => (
            <Tag
              tag={t}
              key={id}
              onClick={() => {
                handleListByTag(id);
              }}
            />
          ))}
        </Tags>
      </Card>
      <ArticleList />
      {useOutlet()}
    </>
  );
};

export default Square;
