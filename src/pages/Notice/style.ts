import { List } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  alignitems: center;
`;

export const title = styled.span`
  font-size: 16px;
`;

export const ListItem = styled(List.Item)`
  cursor: pointer;
  background-color: transparent;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const ListItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
