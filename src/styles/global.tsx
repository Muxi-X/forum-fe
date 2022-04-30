import { createGlobalStyle, css } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    font-family: "Microsoft YaHei",  Arial,  "WenQuanYi Micro Hei";
  }

  body {
    background-color:#F2F2F2;
  }
`;

export const w = css`
  background-color: white;
  margin: 0 auto;
  width: 60vw;
`;

export default GlobalStyle;
