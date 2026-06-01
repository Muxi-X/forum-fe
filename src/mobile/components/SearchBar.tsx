import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { mobilePalette } from '../styles';

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  background: #fff;
  border: 1px solid ${mobilePalette.line};
  border-radius: 8px;
  padding: 0 12px;
  color: ${mobilePalette.muted};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  color: ${mobilePalette.ink};
  font-size: 14px;
  &::placeholder {
    color: #aeb4bc;
  }
`;

const SearchBar: React.FC<{
  placeholder?: string;
  defaultValue?: string;
  onSearch: (value: string) => void;
}> = ({ placeholder = '搜索茶馆', defaultValue = '', onSearch }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
    >
      <SearchOutlined />
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
    </Form>
  );
};

export default SearchBar;
