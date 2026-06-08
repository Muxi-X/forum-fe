import React, { useEffect } from 'react';
import styled from 'styled-components';
import { mobileRadius } from '../styles';

const Box = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(96px + env(safe-area-inset-bottom));
  z-index: 120;
  min-width: 118px;
  max-width: min(280px, calc(100vw - 48px));
  transform: translateX(-50%);
  padding: 12px 18px;
  border-radius: ${mobileRadius.lg};
  background: rgba(31, 35, 41, 0.82);
  color: #fff;
  text-align: center;
  line-height: 1.45;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.2);
  backdrop-filter: blur(12px);
`;

const MobileToast: React.FC<{
  text?: string;
  onClose?: () => void;
  duration?: number;
}> = ({ text, onClose, duration = 1800 }) => {
  useEffect(() => {
    if (!text || !onClose) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose, text]);

  if (!text) return null;
  return <Box>{text}</Box>;
};

export default MobileToast;
