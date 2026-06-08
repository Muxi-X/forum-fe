import React from 'react';
import { mastergoAssets, TeaCupAsset } from '../assets/mastergo';

const srcMap: Record<TeaCupAsset, string> = {
  small: mastergoAssets.decorations.teaCupSmall,
  smallAlt: mastergoAssets.decorations.teaCupSmallAlt,
  large: mastergoAssets.decorations.teaCupLarge,
};

const TeaCupHeroSvg: React.FC<{
  className?: string;
  variant?: TeaCupAsset;
}> = ({ className, variant = 'large' }) => (
  <img className={className} src={srcMap[variant]} alt="" aria-hidden="true" />
);

export default TeaCupHeroSvg;
