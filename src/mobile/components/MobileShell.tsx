import React from 'react';
import styled from 'styled-components';
import MobileTopBar from './MobileTopBar';
import MobileBottomTabs from './MobileBottomTabs';
import { MobilePage, ScrollBody, mobilePalette } from '../styles';

const Page = styled(MobilePage)`
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  background: ${mobilePalette.bg};
`;

const MobileShell: React.FC<{
  title?: string;
  back?: boolean;
  tabs?: boolean;
  showTopBar?: boolean;
  borderlessTopBar?: boolean;
  right?: 'notice' | 'edit' | 'add';
  onRight?: () => void;
  children: React.ReactNode;
}> = ({
  title = '',
  back,
  tabs = true,
  showTopBar = true,
  borderlessTopBar,
  right,
  onRight,
  children,
}) => (
  <Page>
    {showTopBar ? (
      <MobileTopBar
        title={title}
        back={back}
        right={right}
        onRight={onRight}
        borderless={borderlessTopBar}
      />
    ) : null}
    <ScrollBody withTabs={tabs}>{children}</ScrollBody>
    {tabs ? <MobileBottomTabs /> : null}
  </Page>
);

export default MobileShell;
