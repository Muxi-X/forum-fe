import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DEFAULT_AVATAR = 'https://ossforum.muxixyz.com/default/defaultAvatar.png';

const Avatar = styled.img<{
  size: number;
  bordered?: boolean;
}>`
  flex: 0 0 ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: inline-block;
  object-fit: cover;
  border-radius: 50%;
  background: #f0f1f4 padding-box;
  background: #f0f1f4 padding-box,
    ${(props) =>
        props.bordered
          ? 'linear-gradient(180deg, #fe9800 0%, #fff04e 60%, #ecff46 100%)'
          : 'linear-gradient(#f0f1f4, #f0f1f4)'}
      border-box;
  border: ${(props) => (props.bordered ? 2 : 0)}px solid transparent;
`;

const normalizeAvatarUrl = (url?: string | null) => {
  const value = url?.trim();
  if (!value) return undefined;
  if (value.includes('/default/avatar') || value.includes('/default/defaultAvatar')) {
    return undefined;
  }
  return value;
};

const MobileAvatar: React.FC<{
  url?: string | null;
  size?: number;
  bordered?: boolean;
  className?: string;
}> = ({ url, size = 32, bordered, className }) => {
  const normalized = normalizeAvatarUrl(url) || DEFAULT_AVATAR;
  const [src, setSrc] = useState(normalized);

  useEffect(() => {
    setSrc(normalized);
  }, [normalized]);

  return (
    <Avatar
      className={className}
      size={size}
      src={src}
      bordered={bordered}
      alt=""
      aria-hidden
      onError={() => {
        if (src !== DEFAULT_AVATAR) setSrc(DEFAULT_AVATAR);
      }}
    />
  );
};

export default MobileAvatar;
