// const [list, setlist] = useState([])

import { Button, List, Skeleton } from 'antd';
import Service from 'service/fetch';
import { useNavigate } from 'react-router';
import Avatar from 'components/Avatar/avatar';
import React, { useEffect, useState } from 'react';


interface DataType {
  gender?: string;
  name: {
    title?: string;
    first?: string;
    last?: string;
  };
  email?: string;
  picture: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  nat?: string;
  loading: boolean;
}

const count = 3;

const PostList: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [list, setList] = useState<DataType[]>([]);

  const nav = useNavigate()
  useEffect(() => {
    let id = +(localStorage.getItem('id') as string);
    Service.getListByuser(id).then((res: any) => {
      setInitLoading(false);
      setList(res.list)
      setData(res.list);
    });
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
    );
    let id = +(localStorage.getItem('id') as string);
    Service.getListByuser(id).then((res: any) => {
      setInitLoading(false);
      setList(res.list)
      setData(res.list);
      window.dispatchEvent(new Event('resize'));
    });
  };

  const handleMore = (article_id: string) => {
    nav(`/article/${article_id}`);
  }

  const handleDelete = (article_id: string) => {
    Service.deleteArt(article_id).then((res: any) => {
      location.reload();
    })
  }
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      renderItem={(item: any) => (
        <List.Item
          actions={[<a key="list-loadmore-edit" onClick={() => { handleDelete(item.aid) }}>delete</a>, <a onClick={() => { handleMore(item.aid) }} key="list-loadmore-more">more</a>]}
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={<Avatar />}
              title={<div>{item.title}</div>}
              description={item.content}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default PostList;
