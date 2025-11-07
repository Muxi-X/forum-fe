import { css } from 'styled-components';

const sizes = {
  bigDesktop: 1440,
  desktop: 992,
  tablet: 768,
  phone: 576,
};

type Sizes = typeof sizes;
type Media = {
  [K in keyof Sizes]: (args: Parameters<typeof css>[0]) => ReturnType<typeof css>;
};

const media = Object.keys(sizes).reduce<Partial<Media>>((acc, label) => {
  acc[label as keyof Sizes] = (args: Parameters<typeof css>[0]) => css`
    @media (max-width: ${sizes[label as keyof Sizes] / 16}em) {
      ${css(args)}
    }
  `;

  return acc;
}, {}) as Media;

export default media;
