import React from 'react';
import styled from 'styled-components';
import logo from 'assets/image/logo1.png';

const Wrapper = styled.div`
  user-select: none;
  width: 100vw;
  text-align: center;
  line-height: 10vh;
  height: 10vh;
  font-size: 16px;
  color: rgba(255, 171, 0, 1);
  img {
    height: 32px;
    width: auto;
    margin-right: 2rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <Wrapper>
      <img alt="logo" src={logo} />
      谨在此对每一位认真工作的木犀人表达深刻感谢
    </Wrapper>
  );
};

export default Footer;
