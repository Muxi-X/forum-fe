import React from 'react';
import styled from 'styled-components';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { mobilePalette } from '../styles';

const Wrap = styled.div`
  display: inline-flex;
  gap: 6px;
  color: ${mobilePalette.orange};
  font-size: 22px;
`;

const StarRating: React.FC<{ value: number; onChange?: (value: number) => void }> = ({
  value,
  onChange,
}) => (
  <Wrap>
    {[1, 2, 3, 4, 5].map((item) => (
      <button
        key={item}
        type="button"
        onClick={() => onChange?.(item)}
        style={{ background: 'transparent', color: 'inherit' }}
      >
        {item <= value ? <StarFilled /> : <StarOutlined />}
      </button>
    ))}
  </Wrap>
);

export default StarRating;
