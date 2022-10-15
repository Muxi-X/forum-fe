import React from 'react';
import * as style from './style';

interface TagProps {
  tag: string;
  size?: 'small' | 'normal' | 'big';
  count?: number;
  onClick?: any;
  trigger?: boolean;
  type?: 'filter' | 'tag';
  inArticle?: boolean;
}

interface CategoryProps {
  children: string;
  className?: string;
  trigger?: boolean;
  onClick?: () => void;
}

const Category: React.FC<CategoryProps> = ({
  children,
  className,
  trigger = false,
  onClick,
}) => {
  return (
    <style.CategoryDiv onClick={onClick} trigger={trigger} className={className}>
      {children}
    </style.CategoryDiv>
  );
};

const TagCp: React.FC<TagProps> = ({
  tag,
  trigger = false,
  type = 'tag',
  onClick,
  inArticle = false,
}) => {
  return (
    <style.TagWarpper
      inArticle={inArticle}
      type={type}
      trigger={trigger}
      onClick={onClick}
    >
      {tag}
    </style.TagWarpper>
  );
};

interface CompoundedComponent extends React.FC<TagProps> {
  Category: typeof Category;
}

const Tag = TagCp as CompoundedComponent;

Tag.Category = Category;

export default Tag;
