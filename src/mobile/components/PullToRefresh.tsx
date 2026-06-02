import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';

const THRESHOLD = 48;
const MAX_PULL = 72;
const MIN_REFRESH_MS = 520;
const REFRESH_TIMEOUT_MS = 8000;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Root = styled.div`
  min-height: inherit;
  overscroll-behavior-y: contain;
`;

const Indicator = styled.div<{ pull: number; active: boolean }>`
  position: fixed;
  left: 50%;
  top: calc(10px + env(safe-area-inset-top));
  z-index: 80;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 13px;
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 255, 255, 0.82);
  color: ${mobilePalette.inkSoft};
  font-size: 12px;
  font-weight: 700;
  pointer-events: none;
  opacity: ${(props) => (props.active ? 1 : 0)};
  box-shadow: 0 10px 26px rgba(16, 24, 40, 0.12);
  backdrop-filter: blur(16px);
  transform: translate3d(-50%, ${(props) => Math.min(props.pull - 50, 6)}px, 0);
  transition: opacity ${mobileMotion.fast}, transform ${mobileMotion.normal};
`;

const Content = styled.div<{ pull: number; active: boolean }>`
  transform: translate3d(
    0,
    ${(props) => (props.active ? Math.min(props.pull * 0.18, 12) : 0)}px,
    0
  );
  transition: transform ${mobileMotion.normal};
`;

const SpinnerShell = styled.span<{ pull: number }>`
  display: inline-grid;
  place-items: center;
  width: 15px;
  height: 15px;
  transform: rotate(${(props) => props.pull * 4}deg);
`;

const Spinner = styled.span<{ refreshing: boolean }>`
  display: block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid rgba(254, 152, 0, 0.18);
  border-top-color: ${mobilePalette.orange};
  animation: ${(props) => (props.refreshing ? spin : 'none')} 760ms linear infinite;
  will-change: transform;
`;

const PullToRefresh: React.FC<{
  disabled?: boolean;
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}> = ({ disabled, onRefresh, children }) => {
  const startYRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'pulling' | 'ready' | 'refreshing'>('idle');
  const active = phase !== 'idle';
  const refreshing = phase === 'refreshing';

  const reset = () => {
    startYRef.current = null;
    pointerIdRef.current = null;
    setPull(0);
    setPhase('idle');
  };

  const canStart = () =>
    !disabled &&
    !refreshing &&
    (window.scrollY <= 1 || document.documentElement.scrollTop <= 1);

  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element &&
    Boolean(target.closest('button, a, input, textarea, select, [role="button"]'));

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (isInteractiveTarget(event.target)) return;
    if (!canStart()) return;
    startYRef.current = event.clientY;
    pointerIdRef.current = event.pointerId;
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (pointerIdRef.current !== event.pointerId) return;
    if (startYRef.current === null || disabled || refreshing) return;
    const distance = event.clientY - startYRef.current;
    if (distance <= 0) {
      reset();
      return;
    }
    if (!canStart() && pull === 0) return;
    const nextPull = Math.min(MAX_PULL, distance * 0.58);
    if (nextPull > 10) event.preventDefault();
    setPull(nextPull);
    setPhase(nextPull >= THRESHOLD ? 'ready' : 'pulling');
  };

  const handlePointerUp = async (event: React.PointerEvent) => {
    if (pointerIdRef.current !== event.pointerId) return;
    const target = event.currentTarget;
    const pointerId = event.pointerId;
    if (phase !== 'ready') {
      reset();
      return;
    }
    setPull(56);
    setPhase('refreshing');
    try {
      await Promise.all([
        Promise.race([
          Promise.resolve(onRefresh()),
          new Promise((resolve) => {
            window.setTimeout(resolve, REFRESH_TIMEOUT_MS);
          }),
        ]),
        new Promise((resolve) => {
          window.setTimeout(resolve, MIN_REFRESH_MS);
        }),
      ]);
    } finally {
      if (target.hasPointerCapture?.(pointerId) && target.releasePointerCapture) {
        target.releasePointerCapture(pointerId);
      }
      reset();
    }
  };

  const label =
    phase === 'refreshing' ? '正在刷新' : phase === 'ready' ? '松手刷新' : '下拉刷新';

  return (
    <Root
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={reset}
    >
      <Indicator pull={pull} active={active} aria-live="polite" aria-hidden={!active}>
        {active ? (
          <>
            <SpinnerShell pull={pull}>
              <Spinner refreshing={refreshing} />
            </SpinnerShell>
            {label}
          </>
        ) : null}
      </Indicator>
      <Content pull={pull} active={active}>
        {children}
      </Content>
    </Root>
  );
};

export default PullToRefresh;
