import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
}

const Btn = styled.button`
  cursor: pointer;
  background-color: #157bc8;
`;

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ onClick, children }) => {
  return <Btn onClick={onClick}>{children}</Btn>;
};

export default Button;
