import { css } from 'styled-components';

const Tips = css`
  & {
    position: relative;
  }
  &::after {
    content: attr(data-tip);
    /* 实现垂直居中 */
    position: absolute;
    visibility: hidden;
    top: 50%;
    transform: translate(-50%, 0%);
    transition: all 0.3s;
    left: 100%;
    opacity: 0;
    /* 空白问题 */
    white-space: pre;
    font-size: 16px;
    padding: 5px 10px;
    background-color: rgba(18, 26, 44, 0.8);
    color: #fff;
    box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
  &:hover::after {
    opacity: 0.8;
    transition: all 0.3s;
    transform: translate(-50%, 50%);
    visibility: visible;
    display: block;
  }
`;

export default Tips;
