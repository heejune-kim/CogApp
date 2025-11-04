import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatMain.css';
import imgIsolationMode from '../assets/figma/isolation-mode.svg';
import imgPrimeUpload from '../assets/figma/prime-upload.svg';
import imgMynauiSend from '../assets/figma/mynaui-send.svg';
import imgFluentDocumentSignature from '../assets/figma/document-signature.svg';
import imgFluentDocumentSearch from '../assets/figma/document-search.svg';
import imgTranslateIcon from '../assets/figma/translate-icon.svg';
import imgPcHelperIcon from '../assets/figma/pc-helper-icon.svg';
import imgTitleBarPartsTitleBarMinimize from '../assets/figma/title-control-minimize.svg';
import imgTitleBarPartsTitleBarCaptionMaximize from '../assets/figma/title-control-maximize.svg';
import imgTitleBarPartsTitleBarCaptionClose from '../assets/figma/title-control-close.svg';

export default function ChatMain() {
  const navigate = useNavigate();

  const handleTitleBarDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    window.electronAPI?.startWindowDrag();
  };

  return (
    <div className="bg-[#f7f4f2] relative size-full" data-name="cog_main" data-node-id="97:152">
      {/* Title Bar */}
      <div
        className="absolute bg-white h-[48px] left-0 overflow-clip top-0 w-[1024px] drag-region"
        data-node-id="97:153"
        onMouseDown={handleTitleBarDrag}
      >
        <div className="absolute content-stretch flex gap-[2px] items-start left-[20px] top-[14px]" data-node-id="97:154">
          <div className="h-[25.51px] relative shrink-0 w-[54.99px]" data-name="Isolation_Mode" data-node-id="97:155">
            <img alt="" className="block max-w-none size-full" src={imgIsolationMode} />
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[10px] text-black text-nowrap whitespace-pre" data-node-id="97:160">
            Chat
          </p>
        </div>
      </div>

      {/* Window Control Buttons */}
      <div
        className="absolute bg-white content-stretch flex items-center left-[876px] top-[8px] no-drag-region"
        data-node-id="97:197"
      >
        <div
          className="h-[32px] relative shrink-0 w-[46px]"
          data-name="Title Bar / Parts / Title Bar Caption Control Button"
          data-node-id="97:198"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('minimize')}
        >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarMinimize} />
        </div>
        <div
          className="h-[32px] relative shrink-0 w-[46px]"
          data-name="Title Bar / Parts / Title Bar Caption Control Button"
          data-node-id="97:201"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('maximize')}
        >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionMaximize} />
        </div>
        <div
          className="h-[32px] relative shrink-0 w-[46px]"
          data-name="Title Bar / Parts / Title Bar Caption Control Button"
          data-node-id="97:204"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('close')}
        >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionClose} />
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute content-stretch flex flex-col gap-[42px] items-start left-[212px] top-[228px] w-[600px]" data-node-id="97:161">
        {/* Greeting */}
        <div className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-nowrap whitespace-pre" data-node-id="97:162">
          <p className="mb-0">안녕하세요, JD님.</p>
          <p>무엇을 도와드릴까요?</p>
        </div>

        {/* Input Area */}
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[600px]" data-node-id="97:163">
          <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[8px] relative rounded-[9999px] shrink-0 w-full" data-node-id="97:164">
            <div className="relative shrink-0 size-[32px] cursor-pointer" data-name="prime:upload" data-node-id="97:165">
              <img alt="" className="block max-w-none size-full" src={imgPrimeUpload} />
            </div>
            <input
              type="text"
              placeholder="텍스트를 입력해주세요."
              className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#858585] text-[16px] w-[472px] bg-transparent border-none outline-none px-[10px]"
              data-node-id="97:170"
            />
            <div className="relative shrink-0 size-[24px] cursor-pointer" data-name="mynaui:send" data-node-id="97:171">
              <img alt="" className="block max-w-none size-full" src={imgMynauiSend} />
            </div>
            <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_4px_0px_inset_rgba(0,0,0,0.2)]" />
          </div>
          <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#858585] text-[10px] text-center text-nowrap tracking-[-0.4px] whitespace-pre" data-node-id="97:173">{`Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요. `}</p>
        </div>

        {/* Feature Buttons */}
        <div className="content-start flex flex-wrap gap-[20px] items-start relative shrink-0 w-full" data-node-id="97:174">
          {/* Document Summary */}
          <div
            className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[20px] py-[12px] relative rounded-[9999px] shrink-0 cursor-pointer hover:bg-white transition-colors"
            data-node-id="97:175"
            onClick={() => navigate('/service1')}
          >
            <div className="relative shrink-0 size-[24px]" data-name="fluent:document-signature-48-regular" data-node-id="97:176">
              <img alt="" className="block max-w-none size-full" src={imgFluentDocumentSignature} />
            </div>
            <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" data-node-id="97:178">
              문서 요약하기
            </p>
          </div>

          {/* Document Search */}
          <div
            className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[20px] py-[12px] relative rounded-[9999px] shrink-0 cursor-pointer hover:bg-white transition-colors"
            data-node-id="97:179"
            onClick={() => navigate('/service1')}
          >
            <div className="relative shrink-0 size-[24px]" data-name="fluent:document-search-24-regular" data-node-id="97:180">
              <img alt="" className="block max-w-none size-full" src={imgFluentDocumentSearch} />
            </div>
            <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" data-node-id="97:182">
              문서 질의하기
            </p>
          </div>

          {/* Translate */}
          <div
            className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[20px] py-[12px] relative rounded-[9999px] shrink-0 cursor-pointer hover:bg-white transition-colors"
            data-node-id="97:183"
            onClick={() => navigate('/service2')}
          >
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="hugeicons:translate" data-node-id="97:184">
              <div className="absolute inset-[8.333%]" data-name="Group" data-node-id="97:185">
                <div className="absolute inset-[-3.75%]">
                  <img alt="" className="block max-w-none size-full" src={imgTranslateIcon} />
                </div>
              </div>
            </div>
            <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" data-node-id="97:189">
              번역하기
            </p>
          </div>

          {/* PC Helper */}
          <div
            className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[20px] py-[12px] relative rounded-[9999px] shrink-0 cursor-pointer hover:bg-white transition-colors"
            data-node-id="97:190"
            onClick={() => navigate('/service3')}
          >
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="mage:television-question-mark" data-node-id="97:191">
              <div className="absolute inset-[13.88%_11.46%]" data-name="Group" data-node-id="97:192">
                <div className="absolute inset-[-4.33%_-4.05%]">
                  <img alt="" className="block max-w-none size-full" src={imgPcHelperIcon} />
                </div>
              </div>
            </div>
            <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" data-node-id="97:196">
              내 PC 질의하기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
