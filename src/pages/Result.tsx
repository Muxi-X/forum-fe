import { SmileOutlined } from '@ant-design/icons';
import { Button, Result, Card, Skeleton } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import styled from 'styled-components';
import React from 'react';

const ResultCard = styled(Card)`
  height: 100%;

  h3 {
    color: #acabab;
  }
`;

type resultType = 'published' | '404' | '500' | 'login';

const ResultPage: React.FC<{ type?: resultType }> = ({ type }) => {
  const nav = useNavigate();
  const { state } = useLocation();

  const btn = (
    <Button
      onClick={() => {
        nav('/');
      }}
      type="primary"
    >
      回到主页
    </Button>
  );

  const getResult = (type: resultType) => {
    switch (type) {
      case 'published':
        return <Result icon={<SmileOutlined />} title="发布成功!" extra={btn} />;
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
    </ResultCard>
  );
};

export default ResultPage;
