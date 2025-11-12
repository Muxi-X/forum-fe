import styled, { css } from 'styled-components';
import { color } from 'styles/global';
import media from 'styles/media';

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
  min-width: 3rem;
  text-align: center;
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

  ${media.tablet`
    font-size: 0.9em;
    padding: 4px 0.7em;
    margin: 4px;
    min-width: 2.8em;
  `}

  ${media.phone`
    font-size: 0.85em;
    padding: 3px 0.6em;
    margin: 3px;
    min-width: 2.5em;
  `}
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

  ${media.tablet`
    padding: 0 0.4em;
    margin: 4px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
  `}

  ${media.phone`
    padding: 0 0.3em;
    margin: 3px;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
  `}
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

  ${media.tablet`
    padding: 0.4em 0.8em;
    font-size: 0.9em;
    margin: 0.25em 0.25em 0.25em 0;
  `}

  ${media.phone`
    padding: 0.3em 0.6em;
    font-size: 0.85em;
    margin: 0.2em 0.2em 0.2em 0;
  `}

  :hover {
    background-color: #e4e6eb;
    color: rgba(255, 171, 0, 1);
  }
`;
