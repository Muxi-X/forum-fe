import React from 'react';
import styled from 'styled-components';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'components/Loading';
import { List, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'utils/moment';

const { Item } = List;

type position = 'left' | 'mid' | 'right';

interface IProps {
  list: defs.post_Post[];
  loading: boolean;
  hasMore: boolean;
  run: () => void;
}

const fakeStyle = `
content: '';
height: 12px;
width: 1px;
background-color: rgba(0, 0, 0, 0.25);
position: absolute;
top: 50%;
transform: translateY(-50%);
`;

const PostList = styled(List)`
  background-color: white;
`;

const ArticleItem = styled(Item)`
  cursor: pointer;

  &:hover {
    background-color: rgb(247, 247, 247);
  }

  h2 {
    font-weight: bolder;
    margin-bottom: 0;
  }
  border-bottom: 3px solid rgba(0, 0, 0, 0.06) !important;
`;

const ArticleInfo = styled.span<{ position: position }>`
  color: rgba(0, 0, 0, 0.45);
  position: relative;
  ${(props) =>
    props.position === 'left'
      ? 'padding-right: 1em'
      : `::before {
           ${fakeStyle}
           left: 0;
          }
        padding-left: 1em`}

  ${(props) =>
    props.position === 'mid'
      ? ` 
          ::before {
             ${fakeStyle}
             left: 0;
          }
          padding: 0 1em;
  `
      : ''}
`;

const IconText: React.FC<{ icon: any; text: string }> = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const renderItem = (item: defs.post_Post) => {
  return (
    <Link to={`/article/${item.id}`} target={'_blank'}>
      <ArticleItem
        key={item.title}
        actions={[
          <IconText
            icon={StarOutlined}
            text={`${item.collection_num ? item.collection_num : 0}`}
            key="list-vertical-star-o"
          />,
          <IconText
            icon={LikeOutlined}
            text={`${item.like_num ? item.like_num : 0}`}
            key="list-vertical-like-o"
          />,
          <IconText
            icon={MessageOutlined}
            text={`${item.comment_num ? item.comment_num : 0}`}
            key="list-vertical-message"
          />,
        ]}
      >
        <ArticleInfo position="left">{item.creator_name}</ArticleInfo>
        <ArticleInfo position="mid">{moment(item.time).fromNow()}</ArticleInfo>
        <ArticleInfo position="right">{`${item.category} · ${
          item ? (item.tags as any)[0] : ''
        }`}</ArticleInfo>
        <h2>{item.title}</h2>
        {item.summary}
      </ArticleItem>
    </Link>
  );
};

const ArticleList: React.FC<IProps> = ({ list, loading, run, hasMore }) => {
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <InfiniteScroll
          dataLength={list.length}
          next={run}
          hasMore={hasMore}
          loader={<></>}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <PostList
            itemLayout="vertical"
            size="small"
            dataSource={list}
            renderItem={renderItem as any}
          />
        </InfiniteScroll>
      )}
    </>
  );
};

export default ArticleList;
