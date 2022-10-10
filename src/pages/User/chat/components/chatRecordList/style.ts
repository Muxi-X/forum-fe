import styled from 'styled-components';

export interface isMyMessage {
  myMessage: boolean;
}

export const Header = styled.header`
  border-bottom: 0.1px solid gray;
  height: 8%;
`;

export const RecordList = styled.div`
  height: 48vh;
  position: relative;
`;

export const Items = styled.ul`
  position: relative;
  overflow: scroll;
  height: 92%;
  margin-bottom: 0;
  margin-top: 0;
`;

export const MessageItem = styled.div<isMyMessage>`
  display: flex;
  width: fit-content;
  flex-direction: ${(props) => (props.myMessage ? 'row' : 'row-reverse;')};
`;

export const MessageWrapper = styled.li<isMyMessage>`
  width: 100%;
  margin: 5px 0;
  display: flex;
  align-items: flex-start;
  justify-content: ${(props) => (props.myMessage ? 'flex-end' : 'flex-start')};
`;

export const Message = styled.ul`
  list-style: none;
`;

export const MessageContent = styled.li<isMyMessage>`
  max-width: 310px;
  min-width: 30px;
  min-height: 42px;
  padding: 10px;
  background: ${(props) => (props.myMessage ? '#78cdf8' : '#cdd7e2')};
  color: #252424;
  border-radius: 10px;
  position: relative;
  text-align: left;
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
  float: ${(props) => (props.myMessage ? 'right' : 'left')};

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: ${(props) =>
      props.myMessage ? '10px solid transparent' : '20px solid #cdd7e2'};
    border-bottom: 10px solid transparent;
    border-left: ${(props) =>
      props.myMessage ? '20px solid #78cdf8' : '10px solid transparent'};
    position: absolute;
    top: 2px;
    left: ${(props) => (props.myMessage ? '' : '-20px')};
    right: ${(props) => (props.myMessage ? '-20px' : '')};
  }
`;

export const MessageTime = styled.li<isMyMessage>`
  color: #8b8b8b;
  font-size: 12px;
  text-align: ${(props) => (props.myMessage ? 'right' : 'left')};
`;

export const Image = styled.img`
  max-width: 200px;
  max-height: 150px;
`;
