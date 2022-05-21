import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SidebarLayout from './SidebarLayout';

describe('<SidebarLayout />', () => {
  test('it should mount', () => {
    render(<SidebarLayout />);
    
    const sidebarLayout = screen.getByTestId('SidebarLayout');

    expect(sidebarLayout).toBeInTheDocument();
  });
});