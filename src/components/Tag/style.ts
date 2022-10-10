import styled from 'styled-components';
import { color } from 'styles/global';

export const TagWarpper = styled.div`
  display: inline-block;
  width: fit-content;
  padding: 0 0.5em;
  border: 1px solid ${color};
  border-radius: 999px;
  color: ${color};
  margin: 5px;
  cursor: pointer;
  height: 21px;
  line-height: 21px;
  font-size: 14px;

  &:hover {
    background-color: rgba(255, 227, 139, 0.35);
  }
`;

export const TriggerTag = styled.div`
  display: inline-block;
  width: fit-content;
  padding: 0 0.5em;
  border: 1px solid ${color};
  border-radius: 999px;
  color: rgb(0, 153, 255);
  margin: 5px;
  cursor: pointer;
  height: 21px;
  line-height: 21px;
  background-color: ${color};
  font-size: 14px;
`;

export const CategoryDiv = styled.div`
  display: inline-block;
  background-color: #f2f3f5;
  color: #515767;
  padding: 0.5em 1em;
  border-radius: 4px;
  transition: background-color 0.15s linear;
  cursor: pointer;

  :hover {
    background-color: #e4e6eb;
  }
`;
