import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import ArticleList from 'components/List';
import BackToTop from 'components/BackTop';
import Banner from 'components/Banner/banner';
import { CATEGORY } from 'config';
import useRequest from 'hooks/useRequest';
import useList from 'store/useList';

const Square: React.FC = () => {
  const { setList, postList } = useList();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [searchParams] = useSearchParams();

  const { loading, run } = useRequest(API.post.getPostListByType_name.request, {
    onSuccess: (res) => {
      if (res.data.posts?.length === 0) {
        message.warning('没有更多文章了');
        setHasMore(false);
      } else setList([...postList, ...(res.data.posts as defs.post_Post[])]);
    },
    manual: true,
  });

  const next = () => {
    setPage(page + 1);
    run({ type_name: 'normal', search_content: query, limit: 2, page: page + 1 });
  };

  useEffect(() => {
    const searchQuery = searchParams.get('query');
    setQuery(searchQuery ? searchQuery : '');
    if (searchQuery)
      run({
        type_name: 'normal',
        search_content: searchQuery as string,
        limit: 20,
        page: page,
      });
    else
      run({
        type_name: 'normal',
        limit: 20,
        page: page,
      });
  }, []);

  return (
    <>
      <ArticleList
        hasMore={hasMore}
        run={next}
        list={postList}
        loading={loading && page === 0}
      />
      <BackToTop />
    </>
  );
};

export default Square;
