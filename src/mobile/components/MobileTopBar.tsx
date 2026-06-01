import React from 'react';
import styled from 'styled-components';
import {
  LeftOutlined,
  BellOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mobilePalette } from '../styles';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  height: 52px;
  display: grid;
  grid-template-columns: 52px 1fr 52px;
  align-items: center;
  background: rgba(255, 254, 250, 0.96);
  border-bottom: 1px solid ${mobilePalette.line};
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: ${mobilePalette.ink};
`;

const IconButton = styled.button`
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  background: transparent;
  color: ${mobilePalette.ink};
  font-size: 18px;
`;

type RightAction = 'notice' | 'edit' | 'add';

const RightIcon = ({ action }: { action?: RightAction }) => {
  if (action === 'notice') return <BellOutlined />;
  if (action === 'add') return <PlusOutlined />;
  if (action === 'edit') return <EditOutlined />;
  return null;
};

const MobileTopBar: React.FC<{
  title: string;
  back?: boolean;
  right?: RightAction;
  onRight?: () => void;
}> = ({ title, back, right, onRight }) => {
  const nav = useNavigate();
  return (
    <Bar>
      <IconButton
        type="button"
        onClick={() => {
          if (back) nav(-1);
        }}
        aria-label="返回"
      >
        {back ? <LeftOutlined /> : null}
      </IconButton>
      <Title>{title}</Title>
      <IconButton type="button" onClick={onRight} aria-label="操作">
        <RightIcon action={right} />
      </IconButton>
    </Bar>
  );
};

export default MobileTopBar;
