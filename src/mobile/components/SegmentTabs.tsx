import React from 'react';
import styled from 'styled-components';
import { mobilePalette } from '../styles';

const Wrap = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 0 0 auto;
  min-width: 54px;
  height: 32px;
  padding: 0 13px;
  border-radius: 999px;
  background: ${(props) => (props.active ? '#fff2cc' : '#fff')};
  border: 1px solid ${(props) => (props.active ? '#ffd66e' : mobilePalette.line)};
  color: ${(props) => (props.active ? '#5d4300' : mobilePalette.muted)};
  font-weight: ${(props) => (props.active ? 700 : 500)};
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
