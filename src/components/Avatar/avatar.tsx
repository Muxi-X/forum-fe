import React from 'react';
import styled from 'styled-components';

interface AvatarProps {
  height?: number | string;
  width?: number | string;
  src?: string;
}

const AvatarWrapper = styled.div<AvatarProps>`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  border-radius: 100%;
  background-color: red;
  cursor: pointer;
`;

const Avatar: React.FC<AvatarProps> = ({ height = '2em', width = '2em', src = '' }) => {
  return <AvatarWrapper height={height} width={width}></AvatarWrapper>;
};

export default Avatar;
