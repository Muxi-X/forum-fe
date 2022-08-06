import { createGlobalStyle, css } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    font-family: "Microsoft YaHei",  Arial,  "WenQuanYi Micro Hei";
  }

  // 引入antd样式 antd默认body是白的 所以要加!important 
  body {
    background-color:#F2F2F2 !important;
  }
`;

// 版心样式
export const w = css`
  margin: 0 auto;
  width: 60vw;
`;

export default GlobalStyle;
