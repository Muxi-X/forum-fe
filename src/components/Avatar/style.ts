import styled from 'styled-components';
import { AvatarProps } from './type';

export const AvatarWrapper = styled.div<AvatarProps>`
  display: inline-block;
  height: ${(props) =>
    typeof props.height === 'string' ? props.height : `${props.height}px`};
  width: ${(props) =>
    typeof props.width === 'string' ? props.width : `${props.width}px`};
  border-radius: 100%;
  background-color: red;
  cursor: pointer;
  overflow: hidden;
  position: relative;
`;

export const AvatarImg = styled.img`
  height: 100%;
  width: 100%;
`;

export const UploadImg = styled.input`
  height: 100%;
  width: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  cursor: pointer;
`;
