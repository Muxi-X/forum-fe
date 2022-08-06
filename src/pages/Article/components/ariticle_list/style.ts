import styled from 'styled-components';
import { w } from 'styles/global';

export const Item = styled.li`
  margin: 0.5em;
  height: 8em;
  border-bottom: 1.5px solid #ebeaea;
  :hover {
    background-color: #f8f8f8;
    cursor: pointer;
  }
`;

export const ItemWrapper = styled.ul`
  padding: 1em;
  list-style: none;
  min-height: 90vh;
  ${w}
`;

export const Content = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  max-height: 2.8em;
  min-height: 2em;
  line-height: 1.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 0.2em;
    height: 1em;
    border-radius: 999px;
    margin-right: 0.5em;
    background-color: rgb(5, 156, 243);
  }
`;

export const Info = styled.div`
  font-size: 1em;
  color: gray;
  display: flex;
  justify-content: space-around;

  span {
    width: fit-content;
    min-width: 3em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
