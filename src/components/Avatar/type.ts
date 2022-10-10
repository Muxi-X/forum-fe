export type Size = 'small' | 'mid' | 'large';

export interface AvatarProps {
  size?: Size;
  src: string | undefined;
  height?: string | number;
  width?: string | number;
  fix?: boolean;
  userId?: number;
  onChange?: (file: File) => void;
  className?: string;
}
