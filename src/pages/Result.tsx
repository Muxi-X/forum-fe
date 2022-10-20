import { SmileOutlined } from '@ant-design/icons';
import { Button, Result, Card, Skeleton } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import styled from 'styled-components';
import React from 'react';
import useDocTitle from 'hooks/useDocTitle';
import { Link } from 'react-router-dom';

const ResultCard = styled(Card)`
  height: 100%;

  h3 {
    color: #acabab;
  }
  .link {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

type resultType = 'published' | '404' | '500' | 'login' | 'updated';

const ResultPage: React.FC<{ type?: resultType }> = ({ type }) => {
  const nav = useNavigate();
  const { state } = useLocation();

  const btn = (
    <Button
      onClick={() => {
        location.href = location.origin;
      }}
      type="primary"
    >
      回到主页
    </Button>
  );

  const getTitle = (type: resultType) => {
    switch (type) {
      case 'published':
        return '发布成功!';
      case 'updated':
        return '更新成功!';
      case '404':
        return '页面不存在';
      case 'login':
        return '登录中';
      default:
        return '发生了意料之外的错误';
    }
  };

  useDocTitle(state ? getTitle((state as any).type) : getTitle(type as resultType));

  const getResult = (type: resultType) => {
    switch (type) {
      case 'published':
        return <Result icon={<SmileOutlined />} title="发布成功!" extra={btn} />;
      case 'updated':
        return <Result icon={<SmileOutlined />} title="更新成功!" extra={btn} />;
      case '404':
        return <Result status="404" title="404" subTitle="页面不存在!" extra={btn} />;
      case 'login':
        return <Skeleton active />;
      default:
        return (
          <Result
            status="500"
            title="500"
            subTitle={<h3>发生了木犀er暂时解决不了的问题呐</h3>}
            extra={btn}
          />
        );
    }
  };

  return (
    <ResultCard>
      {state ? getResult((state as any).type) : getResult(type as resultType)}
      {state && (state as any).id ? (
        <div className="link">
          <Link to={`/article/${(state as any).id}`}>查看文章</Link>
        </div>
      ) : (
        ''
      )}
    </ResultCard>
  );
};

export default ResultPage;
