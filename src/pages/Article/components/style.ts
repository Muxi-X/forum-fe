import styled from 'styled-components';
import { color } from 'styles/global';

export const Wrapper = styled.div`
  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-comment-actions {
    margin-top: 0;
  }

  .ant-comment-inner {
    padding: 6px 0;
  }

  textarea {
    background-color: rgb(240, 240, 240);
    height: 5em;
    outline: none;
    border: none;
    resize: none;
  }
`;

export const CommentBack = styled.span`
  :hover {
    color: ${color}!important;
  }
`;

export const Number = styled.span`
  margin-left: 5px;
`;

export const SubComments = styled.div`
  background: rgba(247, 248, 250, 0.8);
  width: 100%;
  padding: 1.1em;
`;

export const ReplyComments = styled.div`
  display: flex;
  background: #f2f3f5;
  border: 1px solid #e4e6eb;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 12px;
  line-height: 36px;
  height: 36px;
  font-size: 14px;
  color: #8a919f;
`;
