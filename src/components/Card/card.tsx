import React from 'react';
import styled from 'styled-components';

const CardWapper = styled.div<CardProps>`
  height: auto;
  padding: 2em;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 0 20px 0 rgb(0 0 0 / 15%);
  overflow-x: hidden;
`;

interface CardProps extends React.PropsWithChildren {
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return <CardWapper className={className}>{children}</CardWapper>;
};

export default Card;
