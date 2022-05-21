import React, { FC } from 'react';
import './SidebarLayout.css';

interface SidebarLayoutProps {}

const SidebarLayout: FC<SidebarLayoutProps> = () => (
  <div className="SidebarLayout" data-testid="SidebarLayout">
    SidebarLayout Component
  </div>
);

export default SidebarLayout;
