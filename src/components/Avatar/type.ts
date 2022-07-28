export type Size = 'small' | 'mid' | 'large';

export interface AvatarProps {
  size?: Size;
  src?: string;
  height?: string | number;
  width?: string | number;
  fix?: boolean;
}
