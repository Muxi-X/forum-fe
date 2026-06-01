import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DEFAULT_IMAGE =
  'linear-gradient(135deg, rgba(255, 198, 65, 0.38), rgba(112, 183, 126, 0.22))';

const Img = styled.img<{ radius?: number | string }>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: ${(props) =>
    typeof props.radius === 'number' ? `${props.radius}px` : props.radius || 'inherit'};
`;

const Fallback = styled.div<{ radius?: number | string }>`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: ${(props) =>
    typeof props.radius === 'number' ? `${props.radius}px` : props.radius || 'inherit'};
  background: ${DEFAULT_IMAGE};
  color: rgba(121, 85, 72, 0.68);
  font-size: 12px;
`;

const normalizeUrl = (src?: string | null) => {
  const value = src?.trim();
  return value || undefined;
};

const MobileImage: React.FC<{
  src?: string | null;
  alt?: string;
  radius?: number | string;
  className?: string;
  fallbackText?: string;
}> = ({ src, alt = '', radius, className, fallbackText = '茶馆' }) => {
  const normalized = normalizeUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [normalized]);

  if (!normalized || failed) {
    return (
      <Fallback className={className} radius={radius}>
        {fallbackText}
      </Fallback>
    );
  }

  return (
    <Img
      className={className}
      src={normalized}
      alt={alt}
      radius={radius}
      onError={() => setFailed(true)}
    />
  );
};

export default MobileImage;
