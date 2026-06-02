import React from 'react';
import styled from 'styled-components';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { mobilePalette } from '../styles';

const Wrap = styled.div<{ $size: number; $readonly?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => Math.max(3, Math.round(props.$size / 5))}px;
  color: ${mobilePalette.orange};
  font-size: ${(props) => props.$size}px;
  line-height: 1;
  button,
  span {
    width: ${(props) => props.$size + 4}px;
    height: ${(props) => props.$size + 4}px;
    display: inline-grid;
    place-items: center;
    color: inherit;
  }
  button {
    padding: 0;
    background: transparent;
    cursor: pointer;
    transition: transform 150ms ease;
    &:active {
      transform: scale(0.88);
    }
  }
  ${(props) =>
    props.$readonly
      ? `
    color: #ffb300;
  `
      : ''}
`;

const StarRating: React.FC<{
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
}> = ({ value, onChange, size = 22, readonly }) => (
  <Wrap $size={size} $readonly={readonly || !onChange}>
    {[1, 2, 3, 4, 5].map((item) => {
      const icon = item <= value ? <StarFilled /> : <StarOutlined />;
      if (readonly || !onChange) {
        return <span key={item}>{icon}</span>;
      }
      return (
        <button
          key={item}
          type="button"
          aria-label={`评分 ${item} 星`}
          aria-pressed={item === value}
          onClick={() => onChange(item)}
        >
          {icon}
        </button>
      );
    })}
  </Wrap>
);

export default StarRating;
