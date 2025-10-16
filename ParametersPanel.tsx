/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useEffect, useState} from 'react';

interface ParametersPanelProps {
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
  iconSize: 'sm' | 'md' | 'lg';
  onSetIconSize: (size: 'sm' | 'md' | 'lg') => void;
  onClosePanel: () => void;
}

export const ParametersPanel: React.FC<ParametersPanelProps> = ({
  theme,
  onSetTheme,
  iconSize,
  onSetIconSize,
  onClosePanel,
}) => {
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(theme);
  const [localIconSize, setLocalIconSize] = useState<'sm' | 'md' | 'lg'>(iconSize);

  useEffect(() => setLocalTheme(theme), [theme]);
  useEffect(() => setLocalIconSize(iconSize), [iconSize]);

  const handleApply = () => {
    if (localTheme !== theme) onSetTheme(localTheme);
    if (localIconSize !== iconSize) onSetIconSize(localIconSize);
    onClosePanel();
  };

  const handleClose = () => {
    setLocalTheme(theme);
    setLocalIconSize(iconSize);
    onClosePanel();
  };

  return (
    <div className="p-6 bg-gray-50 h-full flex flex-col items-start pt-8">
      {/* Theme Toggle */}
      <div className="w-full max-w-md mb-6">
        <div className="llm-row items-center">
          <label htmlFor="themeToggle" className="llm-label whitespace-nowrap mr-3 flex-shrink-0" style={{minWidth: '150px'}}>
            Dark Mode:
          </label>
          <input
            id="themeToggle"
            type="checkbox"
            checked={localTheme === 'dark'}
            onChange={(e) => setLocalTheme(e.target.checked ? 'dark' : 'light')}
            className="h-5 w-10 cursor-pointer"
            aria-label="Toggle dark theme"
          />
        </div>
      </div>

      {/* Icon Size */}
      <div className="w-full max-w-md mb-4">
        <div className="llm-row items-center">
          <label htmlFor="iconSizeSelect" className="llm-label whitespace-nowrap mr-3 flex-shrink-0" style={{minWidth: '150px'}}>
            Icon Size:
          </label>
          <select
            id="iconSizeSelect"
            value={localIconSize}
            onChange={(e) => setLocalIconSize(e.target.value as 'sm' | 'md' | 'lg')}
            className="llm-input flex-grow"
            aria-label="Select desktop icon size">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 w-full max-w-md flex justify-start gap-3">
        <button onClick={handleApply} className="llm-button" aria-label="Apply all settings and close">
          Apply Settings
        </button>
        <button onClick={handleClose} className="llm-button bg-gray-500 hover:bg-gray-600 active:bg-gray-700" aria-label="Close settings panel without applying current changes">
          Close Settings
        </button>
      </div>
    </div>
  );
};
