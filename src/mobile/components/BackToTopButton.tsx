import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DesignIcon from './DesignIcon';
import { mobileMotion, mobilePalette } from '../styles';

const Button = styled.button<{ visible: boolean; offset?: number }>`
  position: fixed;
  right: max(18px, calc((100vw - 520px) / 2 + 18px));
  bottom: calc(${(props) => props.offset ?? 160}px + env(safe-area-inset-bottom));
  z-index: 34;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: ${mobilePalette.orange};
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.12);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
  transform: translate3d(0, ${(props) => (props.visible ? 0 : 8)}px, 0);
  transition: opacity ${mobileMotion.fast}, transform ${mobileMotion.fast},
    box-shadow ${mobileMotion.fast};
  backdrop-filter: blur(14px);
  &:active {
    transform: scale(0.94);
    box-shadow: 0 8px 20px rgba(16, 24, 40, 0.1);
  }
`;

const BackToTopButton: React.FC<{ offset?: number; threshold?: number }> = ({
  offset,
  threshold = 520,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return (
    <Button
      type="button"
      visible={visible}
      offset={offset}
      aria-label="返回顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <DesignIcon name="chevronUp" size={21} color={mobilePalette.orange} />
    </Button>
  );
};

export default BackToTopButton;
