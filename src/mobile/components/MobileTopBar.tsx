import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { mastergoAssets } from '../assets/mastergo';

const Bar = styled.header<{ borderless?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 20;
  height: 60px;
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  background: #fff;
  border-bottom: ${(props) => (props.borderless ? '0' : '1px solid #d8d8d8')};
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 22px;
  line-height: 1;
  font-weight: 400;
  color: #3d3d3d;
`;

const IconButton = styled.button`
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #3d3d3d;
  font-size: 18px;
  img {
    display: block;
    object-fit: contain;
  }
`;

type RightAction = 'notice' | 'edit' | 'add';

const RightIcon = ({ action }: { action?: RightAction }) => {
  if (action === 'notice') {
    return (
      <img
        src={mastergoAssets.icons.notificationBellUnread}
        alt=""
        style={{ width: 26, height: 26 }}
      />
    );
  }
  if (action === 'add') {
    return (
      <img src={mastergoAssets.icons.addSmall} alt="" style={{ width: 14, height: 14 }} />
    );
  }
  if (action === 'edit') {
    return (
      <img
        src={mastergoAssets.icons.editPencilGray}
        alt=""
        style={{ width: 15, height: 15 }}
      />
    );
  }
  return null;
};

const MobileTopBar: React.FC<{
  title: string;
  back?: boolean;
  right?: RightAction;
  onRight?: () => void;
  borderless?: boolean;
}> = ({ title, back, right, onRight, borderless }) => {
  const nav = useNavigate();
  return (
    <Bar borderless={borderless}>
      <IconButton
        type="button"
        onClick={() => {
          if (back) nav(-1);
        }}
        aria-label="返回"
      >
        {back ? (
          <img
            src={mastergoAssets.icons.backButtonDark}
            alt=""
            style={{ width: 8, height: 14 }}
          />
        ) : null}
      </IconButton>
      <Title>{title}</Title>
      <IconButton type="button" onClick={onRight} aria-label="操作">
        <RightIcon action={right} />
      </IconButton>
    </Bar>
  );
};

export default MobileTopBar;
