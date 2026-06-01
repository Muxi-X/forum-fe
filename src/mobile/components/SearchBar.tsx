import React, { useState } from 'react';
import styled from 'styled-components';
import DesignIcon from './DesignIcon';

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(60, 60, 67, 0.1);
  border-radius: 999px;
  padding: 0 16px;
  color: #fe9800;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.05);
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  color: #3d3d3d;
  font-size: 14px;
  min-height: 24px;
  &::placeholder {
    color: #9ca3af;
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
      <DesignIcon name="search" size={18} color="#fe9800" />
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
    </Form>
  );
};

export default SearchBar;
