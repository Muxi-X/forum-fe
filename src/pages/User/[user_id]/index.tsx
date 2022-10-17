import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import useProfile from 'store/useProfile';
import styled from 'styled-components';
import { Divider, message, List } from 'antd';
import Avatar from 'components/Avatar/avatar';
import useRequest from 'hooks/useRequest';
import Loading from 'components/Loading';
import moment from 'utils/moment';
import { Link } from 'react-router-dom';

const FeedItem = styled.div`
  user-select: none;
  display: flex;
  padding: 4rem;
  justify-content: space-between;
  box-sizing: border-box;
  div {
    display: flex;
    align-items: center;
  }
  p {
    margin: 0;
    padding: 0;
  }
`;

const FeedInfo = styled.div`
  a {
    margin: 2rem;
    font-size: 1.5rem;
  }
`;

const FeedTime = styled.div`
  color: #909090;
`;

const renderItem = (feed: defs.FeedItem, user_id: number, id: number) => (
  <Fragment key={feed.id}>
    <FeedItem>
      <div>
        <Avatar src={feed.user?.avatar_url} size="mid" />
        <FeedInfo>
          <Link to={`/user/${feed.user?.id}`}>{feed.user?.name}</Link>
          <p>{`${feed.action}了`}</p>
          {feed.user?.id == user_id ? '' : `${user_id == id ? '我' : '他'}的文章`}
          <Link to={`/article/${feed.source?.id}`} target="_blank">
            {feed.source?.name}
          </Link>
        </FeedInfo>
      </div>
      <FeedTime>
        {moment(feed.create_time).format(`YYYY-MM-DD`)}
        &nbsp; &nbsp;
        {moment(feed.create_time).format(`HH:mm`)}
      </FeedTime>
    </FeedItem>
    <Divider style={{ margin: 0 }} />
  </Fragment>
);

const Feed: React.FC = () => {
  const { user_id } = useParams();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [feeds, setFeeds] = useState<defs.FeedItem[]>([]);
  const {
    userProfile: { id },
  } = useProfile();
  const {
    data: res,
    loading,
    run,
  } = useRequest(API.feed.getByUser_id.request, {
    onSuccess: (res) => {
      if (res.code === 20103) {
        message.error('对方打开了隐私权限哦');
        setFeeds([]);
      } else if (res.data.list?.length === 0) {
        message.warning('没有更多动态了');
        setHasMore(false);
      } else setFeeds([...feeds, ...(res.data.list as defs.FeedItem[])]);
    },
    manual: true,
  });

  const next = () => {
    setPage(page + 1);
    run({ user_id: +(user_id as string), limit: 10, page: page + 1 });
  };

  useEffect(() => {
    run({ user_id: +(user_id as string), limit: 10, page: 0 });
  }, []);

  return (
    <>
      {loading && page === 0 ? (
        <Loading />
      ) : (
        <InfiniteScroll
          dataLength={feeds.length}
          next={next}
          hasMore={hasMore}
          loader={<></>}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout="vertical"
            size="small"
            dataSource={feeds}
            renderItem={(feed) => renderItem(feed, +(user_id as string), id as number)}
          />
        </InfiniteScroll>
      )}
    </>
  );
};

export default Feed;
