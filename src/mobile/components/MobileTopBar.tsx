import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { mastergoAssets } from '../assets/mastergo';
import { mobilePalette } from '../styles';

const Bar = styled.header<{ borderless?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 20;
  height: calc(56px + env(safe-area-inset-top));
  padding-top: env(safe-area-inset-top);
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  background: rgba(255, 255, 255, 0.86);
  border-bottom: ${(props) =>
    props.borderless ? '0' : `1px solid ${mobilePalette.lineSoft}`};
  backdrop-filter: blur(18px);
`;

const Title = styled.h1`
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
  color: #3d3d3d;
`;

const IconButton = styled.button`
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #3d3d3d;
  font-size: 18px;
  transition: transform 150ms ease, background 150ms ease;
  &:active {
    transform: scale(0.96);
    background: rgba(60, 60, 67, 0.06);
  }
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
