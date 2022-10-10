import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router';
import useRequest from 'hooks/useRequest';
import ArticleList from 'components/List';

const Like: React.FC = () => {
  const { user_id } = useParams();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [list, setList] = useState<defs.post_Post[]>([]);

  const { data, loading, run } = useRequest(API.like.getLikeListByUser_id.request, {
    onSuccess: (res) => {
      if (res.data.posts?.length === 0) {
        message.warning('没有更多文章了');
        setHasMore(false);
      } else setList([...list, ...(res.data.posts as defs.post_Post[])]);
    },
    manual: true,
  });

  const next = () => {
    setPage(page + 1);
    run({ user_id: +(user_id as string), limit: 20, page: page + 1 });
  };

  useEffect(() => {
    run({ user_id: +(user_id as string), limit: 20, page });
  }, []);

  return (
    <ArticleList
      list={list}
      loading={loading && page === 0}
      hasMore={hasMore}
      run={next}
    />
  );
};

export default Like;
