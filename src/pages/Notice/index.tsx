import React from 'react';
import EmptyCard from 'components/EmptyCard';
import useDocTitle from 'hooks/useDocTitle';

const Notice: React.FC = () => {
  useDocTitle('长目飞耳 - 茶馆');
  return <EmptyCard>暂无新通知哦</EmptyCard>;
};

export default Notice;
