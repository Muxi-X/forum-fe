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

  .ant-comment-content-author-name {
    b {
      color: black;
      font-size: 1rem;
      margin: 0 0.8rem;
    }
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

  .like {
    color: ${color};
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

export const Upload = styled.div`
  user-select: none;
  margin-top: 5px;
  .upload {
    font-size: 32px;
  }

  span {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    overflow: hidden;
    :hover {
      color: #ffab00;
    }
  }

  [type='file'] {
    position: absolute;
    cursor: pointer;
    z-index: 1;
    left: -80px;
    opacity: 0;
  }
`;

export const Img = styled.div<{ img: string }>`
  width: 64px;
  height: 64px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${(props) => props.img});
  position: relative;
  background-position: 50%;
  span {
    position: absolute;
    right: 0;
    font-size: 16px;
    color: rgba(255, 171, 0, 1);
    z-index: 10;
    cursor: pointer;
  }
`;
