import React from 'react';
import { useParams } from 'react-router';
import useRequest from 'hooks/useRequest';
import ArticleList from 'components/List';
import Loading from 'components/Loading';

const Feed: React.FC = () => {
  const { user_id } = useParams();

  const { data: res, loading } = useRequest(API.feed.getByUser_id.request, {
    defaultParams: [{ user_id: +(user_id as string) }],
  });

  console.log(res);

  return (
    <>
      动态
      {/* {loading ? <Loading isContent /> : <ArticleList list={res?.data ? res.data : []} />} */}
    </>
  );
};

export default Feed;
