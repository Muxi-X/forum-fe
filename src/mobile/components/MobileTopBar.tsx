import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { mastergoAssets } from '../assets/mastergo';
import { mobilePalette, mobileRadius } from '../styles';
import DesignIcon from './DesignIcon';
import useNotification from 'store/useNotification';

const Bar = styled.header<{ borderless?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 20;
  height: calc(56px + env(safe-area-inset-top));
  padding-top: env(safe-area-inset-top);
  display: grid;
  grid-template-columns: 64px 1fr 64px;
  align-items: center;
  background: linear-gradient(
    180deg,
    rgba(255, 250, 240, 0.94) 0%,
    rgba(255, 255, 255, 0.84) 100%
  );
  border-bottom: ${(props) =>
    props.borderless ? '0' : '1px solid rgba(255, 198, 65, 0.18)'};
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
  position: relative;
  width: 64px;
  height: 56px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #3d3d3d;
  font-size: 18px;
  transition: transform 150ms ease, background 150ms ease;
  &:active {
    background: transparent;
  }
  img {
    display: block;
    object-fit: contain;
  }
  .dot {
    position: absolute;
    right: 20px;
    top: 15px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${mobilePalette.danger};
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
  }
`;

const RightSlot = styled.div`
  width: 64px;
  height: 56px;
`;

const BackPill = styled.span`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
  ${IconButton}:active & {
    transform: scale(0.94);
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 8px 18px rgba(16, 24, 40, 0.08);
  }
`;

type RightAction = 'notice' | 'edit' | 'add';

const RightIcon = ({ action }: { action?: RightAction }) => {
  if (action === 'notice') {
    return <DesignIcon name="bell" size={23} />;
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
  const { totalUnreadCount } = useNotification();
  return (
    <Bar borderless={borderless}>
      {back ? (
        <IconButton type="button" onClick={() => nav(-1)} aria-label="返回">
          <BackPill>
            <img
              src={mastergoAssets.icons.backButtonDark}
              alt=""
              style={{ width: 10, height: 18 }}
            />
          </BackPill>
        </IconButton>
      ) : (
        <RightSlot aria-hidden="true" />
      )}
      <Title>{title}</Title>
      {right || onRight ? (
        <IconButton type="button" onClick={onRight} aria-label="操作">
          <RightIcon action={right} />
          {right === 'notice' && totalUnreadCount > 0 ? <span className="dot" /> : null}
        </IconButton>
      ) : (
        <RightSlot aria-hidden="true" />
      )}
    </Bar>
  );
};

export default MobileTopBar;
