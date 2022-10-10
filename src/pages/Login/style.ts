import styled from 'styled-components';

export const WelcomeTitle = styled.h1`
  color: white;
  font-size: 3rem;
  font-weight: bolder;
`;

export const LoginPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #5995fd;
`;

export const InputField = styled.div`
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;

  i {
    text-align: center;
    line-height: 55px;
    color: #acacac;
    font-size: 1.1rem;
  }
`;

export const LoginInput = styled.input`
  background: 0;
  outline: 0;
  border: 0;
  line-height: 1;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
`;

export const LoginButtons = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 380px;
  width: 100%;
`;

export const LoginButton = styled.button`
  width: 150px;
  background-color: #5995fd;
  border: 0;
  outline: 0;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  &:hover {
    background-color: #8bb2f6;
  }
`;
