import React from 'react';
import styled from 'styled-components';
import { w } from 'styles/global';

const CardWapper = styled.div<CardProps>`
  height: auto;
  padding: 2em;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 0 20px 0 rgb(0 0 0 / 15%);
  overflow-x: hidden;
  ${(props) => (props.content ? w : '')}
`;

interface CardProps extends React.PropsWithChildren {
  content?: boolean | 1 | 0;
}

const Card: React.FC<CardProps> = ({ children, content = true }) => {
  return <CardWapper content={+content as 1 | 0}>{children}</CardWapper>;
};

export default Card;
