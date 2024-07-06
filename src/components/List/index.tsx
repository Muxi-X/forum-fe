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
import { List, Space, Divider, Popover, message, Modal, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'utils/moment';
import useRequest from 'hooks/useRequest';
import useProfile from 'store/useProfile';

const { Item } = List;
const { confirm } = Modal;
type position = 'left' | 'mid' | 'right';

interface IProps {
  list: defs.post_Post[];
  loading: boolean;
  hasMore: boolean;
  header?: React.ReactElement;
  run: () => void;
}
interface ActionProps {
  done?: boolean;
}
const Actio = styled.div<ActionProps>`
  cursor: pointer;
`;

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
    color: black;
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
  nav: Function,
) => {
  const [articleInfo, setArticleInfo] = useState<defs.post_GetPostResponse>({});

  const {
    content_type,
    creator_name,
    creator_avatar,
    creator_id,
    compiled_content,
    category,
    tags,
    time,
    content,
    sub_posts,
    is_collection,
    is_liked,
    like_num,
    collection_num,
  } = articleInfo;

  const [like, setLike] = useState({
    is_liked: is_liked as boolean,
    like_num: like_num as number,
  });

  const { run: postLike } = useRequest(API.like.postLike.request, {
    manual: true,
    onSuccess: () => {
      const likeBoolean = !like.is_liked;
      const newNum = likeBoolean ? like.like_num + 1 : like.like_num - 1;
      setLike({ is_liked: likeBoolean, like_num: newNum });
    },
  });

  const [collect, setCollect] = useState({
    is_collection,
    collection_num: collection_num as number,
  });

  const { run: postCollect } = useRequest(API.collection.postByPost_id.request, {
    manual: true,
    onSuccess: () => {
      const collectBoolean = !collect.is_collection;
      const newNum = collectBoolean
        ? collect.collection_num + 1
        : collect.collection_num - 1;
      setCollect({ is_collection: collectBoolean, collection_num: newNum });
    },
  });

  const showConfirm = () => {
    confirm({
      title: '删除文章',
      content: '删除后不可回复，确认删除此文章吗',
      onOk() {
        del({ post_id: item.id as number }).then(() => {
          message.success('删除成功！');
          setIsDel(index);
        });
      },
      okText: '确认',
      cancelText: '取消',
      centered: true,
    });
  };
  return (
    <>
      {isDel ? null : (
        <Wrapper>
          <Popover
            trigger={['hover', 'click']}
            placement="right"
            content={
              <>
                <Action
                  onClick={() => {
                    nav(`/editor/${item.id}`, { state: { isUpdate: true } });
                  }}
                >
                  编辑
                </Action>
                <Action
                  onClick={() => {
                    showConfirm();
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

          <ArticleItem
            key={item.title}
            actions={[
              <Button
                block
                type="text"
                key="list-vertical-star-o"
                onClick={() => {
                  postCollect({ post_id: +(item.id as number) }, {});
                }}
              >
                <IconText
                  icon={StarOutlined}
                  text={`${
                    collect.is_collection
                      ? item.is_collection
                        ? (item.collection_num as number) - 1
                        : (item.collection_num as number) + 1
                      : item.collection_num
                  }`}
                />
              </Button>,

              <Button
                block
                type="text"
                key="list-vertical-like-o"
                onClick={() => {
                  postLike({}, { target_id: +(item.id as number), type_name: 'post' });
                }}
              >
                <IconText
                  icon={LikeOutlined}
                  text={`${
                    like.is_liked
                      ? item.is_liked
                        ? (item.like_num as number) - 1
                        : (item.like_num as number) + 1
                      : item.like_num
                  }`}
                />
              </Button>,
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
            <Link to={`/article/${item.id}`} target={'_blank'}>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
            </Link>
          </ArticleItem>
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

  const nav = useNavigate();

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
        <PostList
          header={header ? header : ''}
          itemLayout="vertical"
          size="small"
          dataSource={list || []}
          renderItem={(item, i) =>
            renderItem(
              item as any,
              id as number,
              delArticle,
              isDel[i] ? isDel[i].isDel : false,
              handleDel,
              i,
              nav,
            )
          }
        />
        // <InfiniteScroll
        //   dataLength={list.length}
        //   next={run}
        //   hasMore={hasMore}
        //   loader={<></>}
        //   endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        //   scrollableTarget="scrollableDiv"
        // >

        // </InfiniteScroll>
      )}
    </>
  );
};

export default ArticleList;
