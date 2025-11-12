import styled from 'styled-components';
import media from 'styles/media';

interface IProps {
  selected: boolean;
}

export const Item = styled.div<IProps>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'rgb(230, 230, 230)' : '')};

  &::after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: rgb(230, 230, 230);
    position: absolute;
    bottom: 0px;
    left: 50%;
    margin-left: -50%;
  }

  &:hover {
    background-color: rgb(230, 230, 230);
  }
`;

export const Message = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;

  ${media.phone`
    flex-direction: row;
    align-items: flex-start;
  `}
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 0.15em;

  ${media.phone`
    margin-left: 0.5em;
    width: calc(100% - 3em - 0.5em);
    flex-direction: column;
  `}
`;

export const ChatDate = styled.div`
  margin-left: 0.5em;
  font-size: 0.8em;
  color: gray;
  white-space: nowrap;
  flex-shrink: 0;

  ${media.phone`
    margin-left: 0;
    margin-bottom: 0.1em;
    font-size: 0.75em;
  `}
`;

export const Nickname = styled.div`
  max-width: 6em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${media.phone`
    max-width: 100%;
    font-weight: 500;
    margin-bottom: 0.05em;
  `}
`;

export const Content = styled.div`
  width: 50%;
  font-size: 0.8em;
  color: gray;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 12em;

  ${media.phone`
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-width: 100%;
  `}
`;
