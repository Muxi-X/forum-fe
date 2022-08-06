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
    width: 90%;
    height: 1px;
    background-color: rgb(230, 230, 230);
    position: absolute;
    bottom: 0px;
    left: 50%;
    margin-left: -45%;
  }

  &:hover {
    background-color: rgb(230, 230, 230);
  }
`;

export const Message = styled.div`
  display: flex;
`;

export const Info = styled.div`
  margin-left: 1em;
`;

export const Content = styled.div`
  position: absolute;
  width: 50%;
  font-size: 0.8em;
  color: gray;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Nickname = styled.div``;

export const ChatDate = styled.div`
  font-size: 0.8em;
  color: gray;
`;
