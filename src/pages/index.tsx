import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useOutlet } from 'react-router';
import { useRequest } from 'ahooks';
import ArticleList from 'pages/Article/components/ariticle_list/ariticle_list';
import Card from 'components/Card/card';
import Loading from 'components/Loading';
import Banner from 'components/Banner/banner';
import Tag from 'components/Tag/tag';
import { CATEGORY } from 'config';
import useList from 'store/useList';

const Tags = styled.section`
  width: 100vw;
  height: 5vh;
`;

const Square: React.FC = () => {
  const listStore = useList();
  const { loading } = useRequest(API.post.getPostListByType_name.request, {
    onSuccess: (res) => {
      res.data && listStore.setList(res.data);
    },
    defaultParams: [{ type_name: 'normal' }],
  });

  const { run } = useRequest(API.post.getPostListByType_name.request, {
    onSuccess: (res) => {
      if (res.data === null) listStore.setList([]);
      else listStore.setList(res.data);
    },
    manual: true,
  });
  const handleListByTag = (tid: string) => {
    run({ type_name: 'normal', category: tid });
  };
  return (
    <>
      <Banner />
      <Tags>
        {CATEGORY.map((tag, id) => (
          <Tag
            tag={tag}
            key={id}
            onClick={() => {
              handleListByTag(`${id}`);
            }}
          />
        ))}
      </Tags>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ArticleList />
        </>
      )}
    </>
  );
};

export default Square;
