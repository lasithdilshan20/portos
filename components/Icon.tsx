/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';
import {AppDefinition} from '../types';

interface IconProps {
  app: AppDefinition;
  onInteract: () => void;
  iconSize?: 'sm' | 'md' | 'lg';
}

export const Icon: React.FC<IconProps> = ({app, onInteract, iconSize = 'md'}) => {
  const containerSize = iconSize === 'sm' ? 'w-24 h-28' : iconSize === 'lg' ? 'w-32 h-36' : 'w-28 h-32';
  const glyphSize = iconSize === 'sm' ? 'text-5xl' : iconSize === 'lg' ? 'text-7xl' : 'text-6xl';
  return (
    <div
      className={`${containerSize} flex flex-col items-center justify-start text-center m-2 p-2 cursor-pointer select-none rounded-xl transition-all hover:bg-white/50 focus:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 icon-hover-glow`}
      onClick={onInteract}
      onKeyDown={(e) => e.key === 'Enter' && onInteract()}
      tabIndex={0}
      role="button"
      aria-label={`Open ${app.name}`}>
      <div className={`${glyphSize} mb-2`}>{app.icon}</div>
      <div className="text-sm text-gray-800 font-semibold break-words max-w-full leading-tight">
        {app.name}
      </div>
    </div>
  );
};
