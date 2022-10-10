import styled from 'styled-components';
import { AvatarProps } from './type';

export const AvatarWrapper = styled.div<Partial<AvatarProps>>`
  display: inline-block;
  height: ${(props) =>
    typeof props.height === 'string' ? props.height : `${props.height}px`};
  width: ${(props) =>
    typeof props.width === 'string' ? props.width : `${props.width}px`};
  border-radius: 100%;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  ${(props) =>
    props.fix
      ? `:hover {
    ::before {
      content: '点击修改头像';
      font-size: 0.8rem;
      color: white;
      position: absolute;
      height: 100%;
      width: 100%;
      text-align: center;
      line-height: 8em;
      background-color: rgba(29,33,41,.5);
    }
  }`
      : null}
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
