/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void; // This prop remains, though its direct trigger (the X button) is removed.
  isAppOpen: boolean;
  appId?: string | null;
  onToggleParameters: () => void;
  onExitToDesktop: () => void;
  isParametersPanelOpen?: boolean;
}

const MenuItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({children, onClick, className}) => (
  <span
    className={`menu-item cursor-pointer hover:text-blue-600 ${className}`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick?.();
    }}
    tabIndex={0}
    role="button">
    {children}
  </span>
);

export const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  isAppOpen,
  onToggleParameters,
  onExitToDesktop,
  isParametersPanelOpen,
}) => {
  return (
    <div className="window-surface w-[800px] h-[600px] bg-white/90 border border-gray-300/80 rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.25)] flex flex-col relative overflow-hidden font-sans backdrop-blur-md">
      {/* Title Bar */}
      <div className="text-white py-2 px-4 font-semibold text-base flex justify-between items-center select-none cursor-default rounded-t-2xl flex-shrink-0"
           style={{background: 'linear-gradient(180deg, #4b5563 0%, #3b4250 60%, #2f3542 100%)', boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.08)'}}>
        <span className="title-bar-text">{title}</span>
        {/* "X" button removed from here */}
      </div>

      {/* Menu Bar */}
      <div className="menu-bar bg-gray-50/90 py-2 px-3 border-b border-gray-200/80 select-none flex gap-4 flex-shrink-0 text-sm text-gray-700 items-center">
        {!isParametersPanelOpen && (
          <MenuItem onClick={onToggleParameters}>
            <span role="img" aria-label="gear">⚙️</span> Settings
          </MenuItem>
        )}
        {isAppOpen && (
          <MenuItem onClick={onExitToDesktop} className="ml-auto">
            Exit to Desktop
          </MenuItem>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};
