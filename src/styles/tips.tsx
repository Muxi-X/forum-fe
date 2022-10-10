import { css } from 'styled-components';

export const Tips = css`
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

export const Slider = css`
  padding: 0.3em 0.5em;
  margin-top: 2em;
  background-image: linear-gradient(rgb(251, 251, 251) 15px, rgba(255, 255, 255, 0)),
    radial-gradient(at center top, rgba(0, 0, 0, 0.4), transparent 70%),
    linear-gradient(0deg, rgb(251, 251, 251) 15px, rgba(255, 255, 255, 0)),
    radial-gradient(at center bottom, rgba(0, 0, 0, 0.4), transparent 70%);
  background-position-x: 0, 0, center, center;
  background-position-y: 0, 0, bottom, bottom;
  background-size: 100% 50px, 100% 15px, 100% 50px, 100% 15px;
  background-repeat: no-repeat;
  background-attachment: local, scroll;
`;
