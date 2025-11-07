import React, { ReactNode } from 'react';
import TitleBar from './TitleBar';
import NavigationDropdown from './NavigationDropdown';
import './Common.css';

interface AppLayoutProps {
  children: ReactNode;
  showNavigation?: boolean; // Whether to show navigation dropdown (false for MainScreen)
  title?: string; // Custom title for title bar
}

/**
 * AppLayout - Common wrapper component for all pages
 * - Includes TitleBar with window controls
 * - Optionally includes NavigationDropdown (not shown on MainScreen)
 * - Provides consistent layout structure
 * - Children content is rendered below title bar and navigation
 */
export default function AppLayout({
  children,
  showNavigation = true,
  title = 'Chat',
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f4f2]">
      <div className="relative size-full min-h-screen">
        {/* Title Bar - Always present */}
        <TitleBar title={title} />

        {/* Navigation Dropdown - Conditionally shown */}
        {showNavigation && <NavigationDropdown />}

        {/* Main Content Area */}
        <div
          className={`absolute left-0 right-0 bottom-0 ${
            showNavigation ? 'top-[92px]' : 'top-[48px]'
          } overflow-hidden`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
