import React from 'react';
import styled from 'styled-components';
import { mobilePalette } from '../styles';

const Wrap = styled.div`
  display: flex;
  gap: 22px;
  overflow-x: auto;
  padding: 10px 16px 12px;
  background: #fff;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  position: relative;
  flex: 0 0 auto;
  min-width: 34px;
  height: 30px;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: 0;
  color: ${(props) => (props.active ? '#fe9800' : mobilePalette.muted)};
  font-weight: ${(props) => (props.active ? 700 : 500)};
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    height: 3px;
    border-radius: 999px;
    background: ${(props) => (props.active ? '#ffc641' : 'transparent')};
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
