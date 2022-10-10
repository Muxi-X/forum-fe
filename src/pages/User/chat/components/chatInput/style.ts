import styled from 'styled-components';

export const InputWrapper = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-height: 100px;
  height: 30%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const InputArea = styled.textarea`
  border: none;
  outline: none;
  flex: 1;
  resize: none;
  padding: 10px;
  font-size: 13px;
  letter-spacing: 2px;
  &::placeholder {
    color: #999;
  }
`;

export const ButtonArea = styled.div`
  align-self: flex-end;
  padding: 3px 10px 10px 0px;
  position: relative;
`;

export const Tips = styled.span`
  font-size: 14px;
  color: #999;
  margin-right: 10px;
`;
