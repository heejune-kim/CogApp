import React from 'react';
import './Common.css';
import imgIsolationMode from '../assets/figma/isolation-mode.svg';
import imgTitleBarMinimize from '../assets/figma/title-control-minimize.svg';
import imgTitleBarMaximize from '../assets/figma/title-control-maximize.svg';
import imgTitleBarClose from '../assets/figma/title-control-close.svg';

interface TitleBarProps {
  title?: string;
}

/**
 * Common TitleBar component
 * - Displays app logo and title
 * - Includes window control buttons (minimize, maximize, close)
 * - Draggable region for window movement
 */
export default function TitleBar({ title = 'Chat' }: TitleBarProps) {
  const handleTitleBarDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    window.electronAPI?.startWindowDrag();
  };

  return (
    <div
      className="absolute bg-white h-[48px] left-0 overflow-clip top-0 w-full drag-region z-50"
      onMouseDown={handleTitleBarDrag}
    >
      {/* Logo and Title */}
      <div className="absolute content-stretch flex gap-[2px] items-start left-[20px] top-[14px]">
        <div className="h-[25.51px] relative shrink-0 w-[54.99px]">
          <img alt="Logo" className="block max-w-none size-full" src={imgIsolationMode} />
        </div>
        <p className="font-['Inter',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[10px] text-black text-nowrap whitespace-pre">
          {title}
        </p>
      </div>

      {/* Window Control Buttons */}
      <div className="absolute bg-white content-stretch flex items-center right-0 top-[8px] no-drag-region">
        {/* Minimize Button */}
        <div
          className="h-[32px] relative shrink-0 w-[46px] cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => window.electronAPI?.windowControl('minimize')}
          title="최소화"
        >
          <img alt="Minimize" className="block max-w-none size-full" src={imgTitleBarMinimize} />
        </div>

        {/* Maximize Button */}
        <div
          className="h-[32px] relative shrink-0 w-[46px] cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => window.electronAPI?.windowControl('maximize')}
          title="최대화"
        >
          <img alt="Maximize" className="block max-w-none size-full" src={imgTitleBarMaximize} />
        </div>

        {/* Close Button */}
        <div
          className="h-[32px] relative shrink-0 w-[46px] cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
          onClick={() => window.electronAPI?.windowControl('close')}
          title="닫기"
        >
          <img alt="Close" className="block max-w-none size-full" src={imgTitleBarClose} />
        </div>
      </div>
    </div>
  );
}
