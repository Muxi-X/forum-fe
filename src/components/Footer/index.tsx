import React from 'react';
import styled from 'styled-components';
import media from 'styles/media';

const Wrapper = styled.div`
  user-select: none;
  width: 100vw;
  text-align: center;
  line-height: 10vh;
  height: 10vh;
  font-size: 16px;
  color: rgba(255, 171, 0, 1);
  ${media.phone`font-size: 12px`}
  img {
    height: 32px;
    width: auto;
    margin-right: 2rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <Wrapper>
      <img alt="logo" src="http://ossforum.muxixyz.com/logo1.png" />
      谨在此对每一位认真工作的木犀人表达深刻感谢
    </Wrapper>
  );
};

export default Footer;
