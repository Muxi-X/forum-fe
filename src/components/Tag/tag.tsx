import React, { useContext } from 'react';
import styled from 'styled-components';

interface TagProps {
  tag: string;
  size?: 'small' | 'normal' | 'big';
  count?: number;
  onClick?: any;
  trigger?: boolean;
}

const TagWarpper = styled.div`
  display: inline-block;
  width: fit-content;
  padding: 0 0.5em;
  border: 1px solid rgb(0, 153, 255);
  border-radius: 999px;
  color: rgb(0, 153, 255);
  margin: 5px;
  cursor: pointer;
  height: 21px;
  line-height: 21px;
  font-size: 14px;

  &:hover {
    background-color: rgb(194, 231, 255);
  }
`;

const TriggerTag = styled.div`
  display: inline-block;
  width: fit-content;
  padding: 0 0.5em;
  border: 1px solid rgb(0, 153, 255);
  border-radius: 999px;
  color: rgb(0, 153, 255);
  margin: 5px;
  cursor: pointer;
  height: 21px;
  line-height: 21px;
  background-color: rgb(194, 231, 255);
  font-size: 14px;
`;

const Tag: React.FC<TagProps> = ({
  tag,
  count,
  size = 'normal',
  onClick,
  trigger = false,
}) => {
  return trigger ? (
    <TriggerTag onClick={onClick}>{tag}</TriggerTag>
  ) : (
    <TagWarpper onClick={onClick}>{tag}</TagWarpper>
  );
};

export default Tag;
