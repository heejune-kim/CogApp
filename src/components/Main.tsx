import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Service1 from './Service1';
import Service2 from './Service2';
import Service3 from './Service3';
import './Main.css';
import imgQuillHamburger from '../assets/figma/quill-hamburger.svg';
import imgGroup from '../assets/figma/settings-group.svg';
import imgLine from '../assets/figma/line.svg';
import imgTitleBarPartsTitleBarMinimize from '../assets/figma/title-control-minimize.svg';
import imgTitleBarPartsTitleBarCaptionMaximize from '../assets/figma/title-control-maximize.svg';
import imgTitleBarPartsTitleBarCaptionClose from '../assets/figma/title-control-close.svg';
import imgPrimeUpload from '../assets/figma/prime-upload.svg';
import imgMynauiSend from '../assets/figma/mynaui-send.svg';

function MainHome() {
  const navigate = useNavigate();
  const handleTitleBarDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    window.electronAPI?.startWindowDrag();
  };
  return (
    <div className="bg-[#f7f4f2] relative size-full" data-name="main" data-node-id="1:204">
      {/* Title Bar */}
      <div className="absolute bg-white h-[48px] left-0 overflow-clip top-0 w-[1024px] drag-region"
        data-node-id="1:212"
        onMouseDown={handleTitleBarDrag}
      >
        <div className="absolute content-stretch flex gap-[5px] items-center left-[20px] top-[14px]" data-node-id="1:213">
          <div className="relative shrink-0 size-[24px]" data-name="line" data-node-id="1:214">
            <img alt="" className="block max-w-none size-full" src={imgLine} />
          </div>
          <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" data-node-id="1:219">
            Galaxy on Chat
          </p>
        </div>
      </div>
      {/* Top Navigation Bar */}
      <div className="absolute bg-white box-border content-stretch flex h-[44px] items-center justify-between left-0 px-[20px] py-0 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] top-[48px] w-[1024px]" data-node-id="1:205">
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-[180deg]">
            <div className="relative size-[24px]" data-name="quill:hamburger" data-node-id="1:206">
              <img alt="" className="block max-w-none size-full" src={imgQuillHamburger} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-[180deg]">
            <div className="overflow-clip relative size-[24px]" data-name="lsicon:setting-outline" data-node-id="1:208">
              <div className="absolute inset-[9.37%]" data-name="Group" data-node-id="1:209">
                <div className="absolute inset-[-3.59%]">
                  <img alt="" className="block max-w-none size-full" src={imgGroup} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Window Control Buttons */}
      <div className="absolute bg-white content-stretch flex items-center left-[876px] top-[8px] no-drag-region"
        data-node-id="1:235">
        <div className="h-[32px] relative shrink-0 w-[46px]"
          data-name="Title Bar / Parts / Title Bar Caption Control Button"
          data-node-id="1:236"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('minimize')}
        >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarMinimize} />
        </div>
        <div className="h-[32px] relative shrink-0 w-[46px]"
          data-name="Title Bar / Parts / Title Bar Caption Control Button"
          data-node-id="1:239"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('maximize')}
          >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionMaximize} />
        </div>
        <div className="h-[32px] relative shrink-0 w-[46px]"
          data-name="Title Bar / Parts / Title Bar Caption Control Button"
          data-node-id="1:242"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('close')}
          >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionClose} />
        </div>
      </div>
      {/* Main Content - Greeting and Options */}
      <div className="absolute content-stretch flex flex-col gap-[42px] items-start left-[20px] top-[245px] w-[982px]" data-node-id="1:220">
        <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-nowrap whitespace-pre" data-node-id="1:221">
          <p className="mb-0">안녕하세요, JD님.</p>
          <p>무엇을 도와드릴까요?</p>
        </div>
        <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-node-id="1:222">
          <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-node-id="1:223">
            <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[14px] relative rounded-[9999px] shrink-0 w-[223px] cursor-pointer" data-node-id="1:224" onClick={() => navigate('/service1')}>
              <p className="font-['Inter:Light',_'Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-nowrap whitespace-pre" data-node-id="1:225">
                문서 요약 및 질의하기
              </p>
            </div>
            <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[14px] relative rounded-[9999px] shrink-0 w-[114px] cursor-pointer" data-node-id="1:226" onClick={() => navigate('/service2')}>
              <p className="font-['Inter:Light',_'Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-nowrap whitespace-pre" data-node-id="1:227">
                번역하기
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[20px] items-end relative shrink-0 w-[982px]" data-node-id="1:228">
            <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[14px] relative rounded-[9999px] shrink-0 w-[152px] cursor-pointer" data-node-id="1:229" onClick={() => navigate('/service3')}>
              <p className="font-['Inter:Light',_'Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-nowrap whitespace-pre" data-node-id="1:230">
                내 PC 도우미
              </p>
            </div>
            <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[14px] relative rounded-[9999px] shrink-0 w-[193px]" data-node-id="1:231">
              <p className="font-['Inter:Light',_'Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-nowrap whitespace-pre" data-node-id="1:232">
                보이스노트 도우미
              </p>
            </div>
            <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[14px] relative rounded-[9999px] shrink-0 w-[205px]" data-node-id="1:233">
              <p className="font-['Inter:Light',_'Noto_Sans_KR:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-nowrap whitespace-pre" data-node-id="1:234">
                갤럭시 온 챗 도우미
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Input Area */}
      <div className="absolute bottom-[20px] content-stretch flex flex-col gap-[8px] items-center left-[20px] w-[984px]" data-node-id="1:245">
        <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[8px] relative rounded-[9999px] shrink-0 w-full" data-node-id="1:246">
          <div className="relative shrink-0 size-[32px]" data-name="prime:upload" data-node-id="1:247">
            <img alt="" className="block max-w-none size-full" src={imgPrimeUpload} />
          </div>
          <div className="relative shrink-0 size-[24px]" data-name="mynaui:send" data-node-id="1:252">
            <img alt="" className="block max-w-none size-full" src={imgMynauiSend} />
          </div>
          <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_4px_0px_inset_rgba(0,0,0,0.2)]" />
        </div>
        <p className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#858585] text-[10px] text-center text-nowrap tracking-[-0.4px] whitespace-pre" data-node-id="1:254">{`Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요. `}</p>
      </div>
    </div>
  );
}

export default function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/service1" element={<Service1 />} />
        <Route path="/service2" element={<Service2 />} />
        <Route path="/service3" element={<Service3 />} />
      </Routes>
    </Router>
  );
}
