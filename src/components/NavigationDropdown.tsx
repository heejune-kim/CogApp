import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Common.css';
import imgEpArrowUp from '../assets/figma/ep-arrow-up.svg';

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: '메인페이지', path: '/' },
  { label: '문서 요약하기', path: '/doc-summary' },
  { label: '문서 질의하기', path: '/doc-chat' },
  { label: '번역하기', path: '/translate' },
  { label: '내 PC 질의하기', path: '/my-pc-chat' },
];

/**
 * Navigation Dropdown Component
 * - Displays current page name
 * - Shows dropdown menu with all navigation options
 * - Highlights current page in menu
 */
export default function NavigationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page label based on path
  const currentItem = menuItems.find(item => item.path === location.pathname);
  const currentLabel = currentItem?.label || '메인페이지';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white border-[#cacaca] border-b border-solid box-border content-stretch flex gap-[16px] h-[44px] items-center left-0 px-[20px] py-0 top-[48px] w-[1024px] z-40"
    >
      <div className="relative">
        {/* Dropdown Trigger */}
        <div
          className="border-[#c9c9c9] border-b border-solid box-border content-stretch flex gap-[8px] items-center justify-end px-0 py-[4px] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black w-[124px]">
            {currentLabel}
          </p>
          <div
            className={`relative shrink-0 size-[16px] transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <img alt="Arrow" className="block max-w-none size-full" src={imgEpArrowUp} />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-[100%] left-0 mt-[4px] bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] py-[8px] z-50">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`px-[16px] py-[8px] cursor-pointer hover:bg-gray-100 transition-colors ${
                  item.path === location.pathname
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-black'
                }`}
                onClick={() => handleMenuItemClick(item.path)}
              >
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] text-[14px] leading-[normal]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
