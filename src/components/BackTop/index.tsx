import { BackTop, Tooltip } from 'antd';
import { UpCircleFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { color } from 'styles/global';
import React from 'react';

const Wrapper = styled(BackTop)`
  font-size: 3.5em;
  color: ${color};
`;

const BackToTop: React.FC = () => {
  return (
    <Wrapper>
      <Tooltip color="gold" title="回到顶部">
        <UpCircleFilled />
      </Tooltip>
    </Wrapper>
  );
};

export default BackToTop;
