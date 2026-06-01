import React from 'react';
import styled from 'styled-components';
import { mobileMotion, mobilePalette, mobileRadius } from '../styles';

const Wrap = styled.div`
  display: inline-flex;
  max-width: calc(100% - 32px);
  gap: 4px;
  overflow-x: auto;
  margin: 12px 16px;
  padding: 4px;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.05);
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 0 0 auto;
  min-width: 58px;
  height: 32px;
  padding: 0 14px;
  border-radius: ${mobileRadius.pill};
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  border: 0;
  color: ${(props) => (props.active ? '#fe9800' : mobilePalette.muted)};
  font-weight: ${(props) => (props.active ? 700 : 500)};
  box-shadow: ${(props) =>
    props.active ? '0 6px 16px rgba(254, 152, 0, 0.14)' : 'none'};
  transition: background ${mobileMotion.fast}, color ${mobileMotion.fast},
    box-shadow ${mobileMotion.fast}, transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
  }
`;

const SegmentTabs: React.FC<{
  items: Array<{ label: string; value: string | number }>;
  value: string | number;
  onChange: (value: string | number) => void;
}> = ({ items, value, onChange }) => (
  <Wrap>
    {items.map((item) => (
      <Tab
        key={item.value}
        type="button"
        active={item.value === value}
        onClick={() => onChange(item.value)}
      >
        {item.label}
      </Tab>
    ))}
  </Wrap>
);

export default SegmentTabs;
