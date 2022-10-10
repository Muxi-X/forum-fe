import { css } from 'styled-components';

type Media = {
  [k in keyof typeof sizes]?: any;
};

const sizes = {
  bigDesktop: 1440,
  desktop: 992,
  tablet: 768,
  phone: 576,
};

const media: Media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (args: any) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(args)}
    }
  `;

  return acc;
}, {});

export default media;
