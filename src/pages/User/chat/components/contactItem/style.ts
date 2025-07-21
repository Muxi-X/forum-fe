import styled from 'styled-components';

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
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 0.15em;
`;

export const Content = styled.div`
  width: 50%;
  font-size: 0.8em;
  color: gray;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 12em;
`;

export const Nickname = styled.div`
  max-width: 6em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ChatDate = styled.div`
  margin-left: 0.5em;
  font-size: 0.8em;
  color: gray;
  white-space: nowrap;
  flex-shrink: 0;
`;
