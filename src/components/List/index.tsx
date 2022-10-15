import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'components/Loading';
import { List, Space, Divider, Popover, message } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'utils/moment';
import useRequest from 'hooks/useRequest';
import useProfile from 'store/useProfile';

const { Item } = List;

type position = 'left' | 'mid' | 'right';

interface IProps {
  list: defs.post_Post[];
  loading: boolean;
  hasMore: boolean;
  header?: React.ReactElement;
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
  position: relative;

  h2 {
    font-weight: bolder;
    margin-bottom: 0;
  }
  border-bottom: 3px solid rgba(0, 0, 0, 0.06) !important;

  p {
    overflow: hidden;
    /*文本不会换行*/
    white-space: nowrap;
    /*当文本溢出包含元素时，以省略号表示超出的文本*/
    text-overflow: ellipsis;
  }
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

const Wrapper = styled.div`
  position: relative;
  .extra {
    position: absolute;
    color: #909090;
    right: 1rem;
    top: 0.5rem;
    font-size: 1.7rem;
    z-index: 999;
    cursor: pointer;
    visibility: hidden;

    :hover {
      color: rgba(255, 171, 0, 1);
    }
  }

  &:hover .extra {
    visibility: visible;
  }

  &:hover {
    background-color: rgb(247, 247, 247);
  }
`;

const Action = styled.div`
  user-select: none;
  color: #909090;
  font-size: 0.8rem;
  padding: 0 1rem;
  cursor: pointer;
  :hover {
    color: rgb(255 208 4);
  }
`;

const IconText: React.FC<{ icon: any; text: string }> = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const renderItem = (
  item: defs.post_Post,
  id: number,
  del: any,
  isDel: boolean,
  setIsDel: Function,
  index: number,
) => {
  return (
    <>
      {isDel ? null : (
        <Wrapper>
          <Popover
            trigger="hover"
            placement="right"
            content={
              <>
                <Action onClick={() => {}}>编辑</Action>
                <Action
                  onClick={() => {
                    del({ post_id: item.id as number }).then(() => {
                      message.success('删除成功！');
                      setIsDel(index);
                    });
                  }}
                >
                  删除
                </Action>
              </>
            }
          >
            {item.creator_id === id ? (
              <div className="extra">
                <EllipsisOutlined />
              </div>
            ) : null}
          </Popover>
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
              <p>{item.summary}</p>
            </ArticleItem>
          </Link>
        </Wrapper>
      )}
    </>
  );
};

const ArticleList: React.FC<IProps> = ({ list, loading, run, hasMore, header }) => {
  const {
    userProfile: { id },
  } = useProfile();
  const { runAsync: delArticle } = useRequest(API.post.deletePostByPost_id.request, {
    manual: true,
  });
  const [isDel, setIsDel] = useState<any[]>(
    list.map((item) => {
      if ((item as any).isDel) return item;
      else return { ...item, isDel: false };
    }),
  );

  const handleDel = (i: number) => {
    const temp = [...isDel];
    temp[i].isDel = true;
    setIsDel(temp);
  };

  useEffect(() => {
    const listWithDel = list.map((item) => {
      if ((item as any).isDel) return item;
      else return { ...item, isDel: false };
    });
    setIsDel(listWithDel);
  }, [list.length]);
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
            header={header ? header : ''}
            itemLayout="vertical"
            size="small"
            dataSource={list}
            renderItem={(item, i) =>
              renderItem(
                item as any,
                id as number,
                delArticle,
                isDel[i] ? isDel[i].isDel : false,
                handleDel,
                i,
              )
            }
          />
        </InfiniteScroll>
      )}
    </>
  );
};

export default ArticleList;
