import React, { useEffect } from 'react';
import styled from 'styled-components';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';

const Mask = styled.div`
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  align-items: end;
  background: rgba(18, 27, 41, 0.42);
  backdrop-filter: blur(8px);
`;

const Sheet = styled.section`
  max-height: min(78vh, 640px);
  overflow: auto;
  border-top-left-radius: ${mobileRadius.xl};
  border-top-right-radius: ${mobileRadius.xl};
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -18px 44px rgba(16, 24, 40, 0.18);
  animation: sheet-in ${mobileMotion.normal};
  @keyframes sheet-in {
    from {
      transform: translateY(24px);
      opacity: 0.72;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Handle = styled.div`
  width: 38px;
  height: 4px;
  margin: 10px auto 8px;
  border-radius: 999px;
  background: rgba(60, 60, 67, 0.22);
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  padding: 0 12px 10px;
  border-bottom: 1px solid ${mobilePalette.lineSoft};
  h2 {
    margin: 0;
    text-align: center;
    font-size: 16px;
    color: ${mobilePalette.ink};
  }
`;

const Body = styled.div`
  padding: 16px 18px calc(18px + env(safe-area-inset-bottom));
`;

const MobileBottomSheet: React.FC<{
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, title, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Mask onClick={onClose}>
      <Sheet onClick={(event) => event.stopPropagation()}>
        <Handle />
        {title ? (
          <Head>
            <h2>{title}</h2>
          </Head>
        ) : null}
        <Body>{children}</Body>
      </Sheet>
    </Mask>
  );
};

export default MobileBottomSheet;
