import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import './Common.css';
import imgPrimeUpload from '../assets/figma/prime-upload.svg';
import imgMynauiSend from '../assets/figma/mynaui-send.svg';
import imgDocSearch from '../assets/figma/document-search.svg';
import imgDocSignature from '../assets/figma/document-signature.svg';
import imgTranslate from '../assets/figma/translate-icon.svg';
import imgPcHelper from '../assets/figma/pc-helper-icon.svg';

/**
 * SCREEN VARIANT CONFIGURATION
 *
 * Change this constant to switch between two main screen variants:
 * - 'VARIANT_1': Screen with input bar and 4 feature buttons (node-id: 97-152)
 * - 'VARIANT_2': Screen with only 4 feature buttons, no input bar (node-id: 115-2)
 */
const ACTIVE_VARIANT: 'VARIANT_1' | 'VARIANT_2' = 'VARIANT_2';

/**
 * MainScreen Component
 *
 * Two design variants available:
 * 1. VARIANT_1 (97-152): Greeting + Input bar + 4 feature buttons
 * 2. VARIANT_2 (115-2): Greeting + 4 feature buttons (no input bar)
 *
 * Features accessible from main screen:
 * - 문서 요약하기 (Document Summary)
 * - 문서 질의하기 (Document Chat)
 * - 번역하기 (Translate)
 * - 내 PC 질의하기 (My PC Chat)
 */
export default function MainScreen() {
  const navigate = useNavigate();

  // Feature button click handlers
  const handleDocSummaryClick = () => navigate('/doc-summary');
  const handleDocChatClick = () => navigate('/doc-chat');
  const handleTranslateClick = () => navigate('/translate');
  const handleMyPcChatClick = () => navigate('/my-pc-chat');

  return (
    <AppLayout showNavigation={false} title="Chat">
      <div className="relative w-full h-full bg-[#f7f4f2]">
        {/* Main Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[20px]">
          {/* Greeting Section */}
          <div className="content-stretch flex flex-col gap-[42px] items-center w-full max-w-[984px]">
            <div className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal leading-[normal] not-italic text-[32px] text-black text-center">
              <p className="mb-0">안녕하세요, JD님.</p>
              <p>무엇을 도와드릴까요?</p>
            </div>

            {/* VARIANT_1: Input Bar (shown when ACTIVE_VARIANT === 'VARIANT_1') */}
            {ACTIVE_VARIANT === 'VARIANT_1' && (
              <div className="content-stretch flex flex-col gap-[8px] items-center w-full max-w-[600px]">
                <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[8px] relative rounded-[9999px] w-full">
                  <div className="relative shrink-0 size-[32px] cursor-pointer">
                    <img alt="Upload" className="block max-w-none size-full" src={imgPrimeUpload} />
                  </div>
                  <input
                    type="text"
                    placeholder="텍스트를 입력해주세요."
                    className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black placeholder:text-[#858585] bg-transparent border-none outline-none flex-1 mx-[16px]"
                  />
                  <div className="relative shrink-0 size-[24px] cursor-pointer">
                    <img alt="Send" className="block max-w-none size-full" src={imgMynauiSend} />
                  </div>
                  <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_4px_0px_inset_rgba(0,0,0,0.2)] rounded-[9999px]" />
                </div>
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal leading-[normal] text-[#858585] text-[10px] text-center tracking-[-0.4px]">
                  Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요.
                </p>
              </div>
            )}

            {/* Feature Buttons - Common for both variants */}
            <div className="flex flex-wrap gap-[20px] items-center justify-center mt-[20px]">
              {/* Document Summary Button */}
              <div
                onClick={handleDocSummaryClick}
                className="flex flex-col items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="bg-white rounded-full p-[20px] shadow-md w-[80px] h-[80px] flex items-center justify-center">
                  <img alt="문서 요약하기" className="w-[40px] h-[40px]" src={imgDocSearch} />
                </div>
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] text-[14px] text-black text-center">
                  문서 요약하기
                </p>
              </div>

              {/* Document Chat Button */}
              <div
                onClick={handleDocChatClick}
                className="flex flex-col items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="bg-white rounded-full p-[20px] shadow-md w-[80px] h-[80px] flex items-center justify-center">
                  <img alt="문서 질의하기" className="w-[40px] h-[40px]" src={imgDocSignature} />
                </div>
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] text-[14px] text-black text-center">
                  문서 질의하기
                </p>
              </div>

              {/* Translate Button */}
              <div
                onClick={handleTranslateClick}
                className="flex flex-col items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="bg-white rounded-full p-[20px] shadow-md w-[80px] h-[80px] flex items-center justify-center">
                  <img alt="번역하기" className="w-[40px] h-[40px]" src={imgTranslate} />
                </div>
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] text-[14px] text-black text-center">
                  번역하기
                </p>
              </div>

              {/* My PC Chat Button */}
              <div
                onClick={handleMyPcChatClick}
                className="flex flex-col items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="bg-white rounded-full p-[20px] shadow-md w-[80px] h-[80px] flex items-center justify-center">
                  <img alt="내 PC 질의하기" className="w-[40px] h-[40px]" src={imgPcHelper} />
                </div>
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] text-[14px] text-black text-center">
                  내 PC 질의하기
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
