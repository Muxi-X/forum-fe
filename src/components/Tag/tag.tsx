import React from 'react';
import useRequest from 'hooks/useRequest';
import useList from 'store/useList';
import * as style from './style';
import { CATEGORY } from 'config/index';

interface TagProps {
  tag: string;
  size?: 'small' | 'normal' | 'big';
  count?: number;
  onClick?: any;
  trigger?: boolean;
}

interface CategoryProps {
  children: string;
  className?: string;
}

const Category: React.FC<CategoryProps> = ({ children, className }) => {
  return <style.CategoryDiv className={className}>{children}</style.CategoryDiv>;
};

const TagCp: React.FC<TagProps> = ({ tag, trigger = false }) => {
  const listStore = useList();
  const { run } = useRequest(API.post.getPostListByType_name.request, {
    onSuccess: (res) => {
      if (res.data === null) listStore.setList([]);
      else listStore.setList(res.data);
    },
    manual: true,
  });
  const handleTagClick = () => {
    run({ type_name: 'normal', category: tag });
  };

  return trigger ? (
    <style.TriggerTag
      onClick={(e) => {
        e.stopPropagation();
        handleTagClick();
      }}
    >
      {tag}
    </style.TriggerTag>
  ) : (
    <style.TagWarpper
      onClick={(e) => {
        e.stopPropagation();
        handleTagClick();
      }}
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
