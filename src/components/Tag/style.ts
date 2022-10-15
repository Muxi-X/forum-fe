import styled, { css } from 'styled-components';
import { color } from 'styles/global';

interface isTrigger {
  trigger?: boolean;
}

interface TagType extends isTrigger {
  type: 'filter' | 'tag';
  inArticle: boolean;
}

const tag = css`
  display: inline-block;
  width: fit-content;
  padding: 5px 0.8rem;
  margin: 5px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 999px;
  user-select: none;
`;

const filterTrigger = css`
  background-color: rgba(255, 171, 0, 1);
  color: white;
`;

const tagTrigger = css`
  background-color: ${color};
`;

export const TagWarpper = styled.div<TagType>`
  ${tag}
  ${(props) => (props.inArticle ? 'padding: 2px 0.8rem;' : '')}
  border: ${(props) =>
    props.type === 'tag' ? `1px solid rgba(255, 171, 0, 1)` : 'none'};
  color: ${(props) => (props.type === 'tag' ? 'rgba(255, 171, 0, 1)' : '#8a919f')};
  background-color: ${(props) => (props.type === 'tag' ? '' : 'white')};
  &:hover {
    ${(props) => {
      if (props.trigger) return;
      else
        return props.type === 'tag'
          ? `background-color: ${color}`
          : 'color: rgba(255, 171, 0, 1)';
    }}
  }
  ${(props) => {
    if (props.trigger && props.type === 'filter') return filterTrigger;
    else if (props.trigger && props.type === 'tag') return tagTrigger;
  }}
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

export const CategoryDiv = styled.div<isTrigger>`
  user-select: none;
  display: inline-block;
  background-color: ${(props) => (props.trigger ? '#e4e6eb' : '#f2f3f5')};
  color: ${(props) => (props.trigger ? 'rgba(255, 171, 0, 1)' : '#515767')};
  padding: 0.5em 1em;
  border-radius: 4px;
  transition: background-color 0.15s linear;
  cursor: pointer;

  :hover {
    background-color: #e4e6eb;
    color: rgba(255, 171, 0, 1);
  }
`;
