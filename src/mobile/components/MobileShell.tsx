import React from 'react';
import MobileTopBar from './MobileTopBar';
import MobileBottomTabs from './MobileBottomTabs';
import { MobilePage, ScrollBody } from '../styles';

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
  <MobilePage>
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
  </MobilePage>
);

export default MobileShell;
