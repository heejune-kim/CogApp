import React, { useCallback, useEffect, useState, useRef } from 'react';
import './Service1.css';

import { useNavigate } from 'react-router-dom';
import imgImage8 from '../assets/image-8.png';
import imgFrame1000014255 from '../assets/user-avatar.png';
import imgGroup from '../assets/upload-icon.svg';
import imgVector100 from '../assets/divider-line.svg';
import imgQuillHamburger from '../assets/quill-hamburger.svg';
import imgGroup1 from '../assets/settings-group.svg';
import imgLine from '../assets/line.svg';
import imgTitleBarPartsTitleBarCaptionControlButton from '../assets/title-control-1.svg';
import imgTitleBarPartsTitleBarCaptionControlButton1 from '../assets/title-control-2.svg';
import imgTitleBarPartsTitleBarCaptionControlButton2 from '../assets/title-control-3.svg';
import imgPrimeUpload from '../assets/upload.svg';
import imgMynauiSend from '../assets/send.svg';

const { ipcRenderer } = window.require ? window.require('electron') : {};

type ElectronFile = File & { path?: string }; // Electron이 File에 path를 붙여줌

const sendFilePathToServer = async (filePath: string) => {
  await fetch('http://localhost:8000/set-rag-path/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rag_path: filePath }),
  });

  // Get RAG_PATH to confirm
  const response = await fetch('http://localhost:8000/get-rag-path/');
  const data = await response.json();
  console.log('Current RAG_PATH:', data.RAG_PATH);
  //alert(`RAG_PATH set to: ${data.RAG_PATH}`);
};

const Service1: React.FC = () => {
  //const [paths, setPaths] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState<Array<{ question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // 필수: drop 허용
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as ElectronFile[];
    const filePaths = files.map(f => f.name);
    const _paths = files.map(f => window.electronAPI.getPathForFile(f));
    sendFilePathToServer(_paths[0]);
    setFileName(files[0].name);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  // Main chat handler function
  const handleSendChat = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    // Add question to chat list
    setChatList(prev => [...prev, { question: inputText, answer: '' }]);
    setInputText('');
    // Fetch answer from API
    try {
      const response = await fetch('http://localhost:8000/chat-msg/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputText })
      });
      const answerRes = await response.json();
      // You may want to fetch the answer from another endpoint, adjust as needed
      const answerText = answerRes?.status || '응답을 가져올 수 없습니다.';
      setChatList(prev => {
        const updated = [...prev];
        //alert(answerText);
        //updated[updated.length - 1].answer = answerText + " (from Service1)";
        updated[updated.length - 1].answer = answerText;
        return updated;
      });
    } catch (err) {
      setChatList(prev => {
        const updated = [...prev];
        updated[updated.length - 1].answer = 'API 요청 실패';
        return updated;
      });
    }
    setLoading(false);
  };


  const handleOpenFile = async () => {
    const res = await window.electronAPI.openFileDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
    });
    if (!res.canceled && res.filePaths?.length) {
      sendFilePathToServer(res.filePaths[0]);
      const _fileName = res.filePaths[0].split('\\').pop().split('/').pop();
      setFileName(_fileName || null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatList]);

  /*
  const handleClick = (action: string) => {
    alert("Button clicked!");
    window.electronAPI?.windowControl(action);
  }
  */

  return (
    <div className="bg-[#f7f4f2] relative size-full" data-name="service_1" data-node-id="1:355">
      <div className="absolute bg-white h-[788px] left-0 top-[92px] w-80" data-node-id="1:356">
        <div className="h-[788px] overflow-clip relative w-80">
          <div className="absolute contents left-4 top-[43px]" data-node-id="1:357">
            <div className="absolute bg-[#f1f1f1] h-[172px] left-4 rounded-[24px] top-[43px] w-72" data-node-id="1:358" />
            <div className="absolute contents left-4 top-[68px]" data-node-id="1:359">
              <div className="absolute h-[30px] left-[145.58px] overflow-clip top-[68px] w-[31.841px]" data-name="solar:upload-line-duotone" data-node-id="1:360">
                <div className="absolute inset-[8.333%]" data-name="Group" data-node-id="1:361">
                  <div className="absolute inset-[-6%_-5.65%]">
                    <img alt="" className="block max-w-none size-full" src={imgGroup} />
                  </div>
                </div>
              </div>
              <div
                className="absolute font-['Inter:Medium',_'Noto_Sans_KR:Regular',_sans-serif] font-medium leading-[0] left-[112.33px] not-italic text-[#afafaf] text-[14px] top-[105px] w-[98.341px]"
                data-node-id="1:364"
                /*
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    // Call REST API to set RAG_PATH
                    const file = files[0];
                    if (file.path) {
                      sendFilePathToServer(file.path);
                      setFileName(file.name);
                    } else {
                      alert('File path is not available in browser environment.');
                      // 브라우저 환경에선 실제 경로를 알 수 없음 (보안상)
                      // 필요하다면 blob URL로 처리
                      const blobUrl = URL.createObjectURL(file);
                      console.warn("Browser build: no file.path. blob url:", blobUrl);
                      setFileName(file.name);
                    }
                  }
                }}
                */
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
                <p className="leading-[normal]">파일 끌어다 놓기</p>
              </div>
              <div className="absolute font-['Inter:Medium',_'Noto_Sans_KR:Regular',_sans-serif] font-medium leading-[0] left-4 not-italic text-[#afafaf] text-[12px] top-[683px] w-72" data-node-id="1:365">
                <p className="leading-[24px]">
                  -제공문서포맷: PDF, DOCX, PPTX, HWP, HWPX...
                  <br aria-hidden="true" className="" />
                  -용량제한: 500MB (1문서 기준)
                  <br aria-hidden="true" className="" />
                  -페이지제한: 100페이지 (1문서 기준)
                </p>
              </div>
              <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[155.14px] not-italic text-[#d9d9d9] text-[12px] top-[129px] w-[12.736px]" data-node-id="1:366">
                <p className="leading-[normal]">or</p>
              </div>
              <div className="absolute h-0 left-[38.38px] top-[136px] w-[106.138px]" data-node-id="1:367">
                <div className="absolute inset-[-1px_-0.94%]">
                  <img alt="" className="block max-w-none size-full" src={imgVector100} />
                </div>
              </div>
              <div className="absolute h-0 left-[178.49px] top-[136px] w-[106.138px]" data-node-id="1:368">
                <div className="absolute inset-[-1px_-0.94%]">
                  <img alt="" className="block max-w-none size-full" src={imgVector100} />
                </div>
              </div>
              <div className="absolute bg-[#387aff] box-border content-stretch flex gap-2.5 items-center justify-center left-[112.33px] px-2.5 py-1.5 rounded-[5px] top-[158px]" data-node-id="1:369" style={{ cursor: 'pointer' }} onClick={handleOpenFile}>
                <div className="font-['Inter:Semi_Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-semibold leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-nowrap text-white" data-node-id="1:370">
                  <p className="[text-overflow:inherit] leading-[normal] overflow-inherit whitespace-pre">파일 선택하기</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute contents left-4 top-[235px]" data-node-id="1:371">
            <div className="absolute bg-[#f1f1f1] box-border content-stretch flex gap-2.5 items-center justify-start left-4 p-[20px] rounded-[24px] top-[235px] w-72" data-node-id="1:372">
              <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0" data-node-id="1:373">
                <div className="content-stretch flex gap-[5px] items-center justify-start relative shrink-0" data-node-id="1:374">
                  <div className="bg-center bg-cover bg-no-repeat shrink-0 size-6" data-name="image 8" data-node-id="1:375" style={{ backgroundImage: `url('${imgImage8}')` }} />
                  <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap" data-node-id="1:376">
                    <p className="leading-[normal] whitespace-pre">
                    {
                      fileName && ( <div>{fileName}</div> )
                    }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#cacaca] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="absolute bg-white box-border content-stretch flex h-11 items-center justify-between left-0 px-5 py-0 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] top-12 w-[1024px]" data-node-id="1:377">
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-[180deg]">
            <div className="relative size-6 cursor-pointer"
              onClick={() => navigate('/')}
              data-name="quill:hamburger"
              data-node-id="1:378">
              <img alt="" className="block max-w-none size-full" src={imgQuillHamburger} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-[180deg]">
            <div className="overflow-clip relative size-6" data-name="lsicon:setting-outline" data-node-id="1:380">
              <div className="absolute inset-[9.37%]" data-name="Group" data-node-id="1:381">
                <div className="absolute inset-[-3.59%]">
                  <img alt="" className="block max-w-none size-full" src={imgGroup1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-white h-12 left-0 overflow-clip top-0 w-[1024px] drag-region" data-node-id="1:384">
        <div className="absolute content-stretch flex gap-[5px] items-center justify-start left-5 top-3.5" data-node-id="1:385">
          <div className="relative shrink-0 size-6" data-name="line" data-node-id="1:386">
            <img alt="" className="block max-w-none size-full" src={imgLine} />
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-nowrap" data-node-id="1:391">
            <p className="leading-[normal] whitespace-pre">Galaxy on Chat</p>
          </div>
        </div>
      </div>

      <div className="absolute left-[340px] top-[132px] w-[640px] h-[calc(100vh-250px)] flex flex-col" data-node-id="1:392">
        <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] not-italic shrink-0 text-[32px] text-black text-nowrap whitespace-pre mb-[42px]" data-node-id="1:393">
          <p className="mb-0">안녕하세요, JD님.</p>
          <p className="">어떤 내용이 궁금하신가요?</p>
        </div>
        {/* 스크롤 가능한 채팅 리스트 영역 */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto flex flex-col gap-[42px] pb-4"
        >
          {chatList.map((chat, idx) => (
            <React.Fragment key={idx}>
              {/* 채팅 내용 예시 */}
              <div className="content-stretch flex gap-4 items-start justify-start w-full">
                {/* Icon for question */}
                <div className="bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] bg-white overflow-clip relative rounded-[16px] shrink-0 size-8" style={{ backgroundImage: `url('${imgFrame1000014255}')` }} />
                {/* Question text */}
                <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black w-[616px]">
                  <p className="leading-[22px]">{chat.question}</p>
                </div>
              </div>

              {/* Input area for answer */}
              <div className="bg-white box-border content-stretch flex flex-col gap-4 items-start justify-start overflow-clip px-4 py-6 rounded-[24px] w-full" >
                <div className="content-stretch flex gap-4 items-start justify-start relative shrink-0 w-full">
                  {/* Icon for answer */}
                  <div className="relative shrink-0 size-8" style={{ marginRight: 8 }}>
                    <img alt="" className="block max-w-none size-full" src={imgPrimeUpload} />
                  </div>
                  {/* Answer text */}
                  <div className="basis-0 font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-black">
                    <p className="mb-0">{chat.answer || (loading && idx === chatList.length - 1 ? '답변을 불러오는 중...' : '')}</p>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
  <div className="absolute bg-white content-stretch flex items-center justify-start left-[876px] top-2 no-drag-region" data-node-id="1:394">
        {/* Title bar control buttons */}
        <div className="h-8 relative shrink-0 w-[46px]" data-name="Title Bar / Parts / Title Bar Caption Control Button" data-node-id="1:395"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('minimize')}
        >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionControlButton} />
        </div>
        <div className="h-8 relative shrink-0 w-[46px]" data-name="Title Bar / Parts / Title Bar Caption Control Button" data-node-id="1:398"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('maximize')}
        >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionControlButton1} />
        </div>
        <div className="h-8 relative shrink-0 w-[46px]" data-name="Title Bar / Parts / Title Bar Caption Control Button" data-node-id="1:401"
          style={{ cursor: 'pointer' }}
          onClick={() => window.electronAPI?.windowControl('close')}
        >
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionControlButton2} />
        </div>
      </div>
      {
        // 하단 고정 안내 문구
      }
      <div className="absolute bottom-5 content-stretch flex flex-col gap-2 items-center justify-start left-[340px] w-[664px]" data-node-id="1:404">
        {/* Input area */}
        <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-5 py-2 relative rounded-[9999px] shrink-0 w-full" data-node-id="1:405">
          {/* Icon for question */}
          <div className="relative shrink-0 size-8" data-name="prime:upload" data-node-id="1:406">
            <img alt="" className="block max-w-none size-full" src={imgPrimeUpload} />
          </div>
          {/* Input text */}
          <div className="basis-0 font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-black" data-node-id="1:410">
            <input
              ref={inputRef}
              className="w-full outline-none"
              placeholder={fileName ? "무엇이든 물어보세요" : "검색할 파일을 선택해 주세요"}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && inputText.trim().length > 0 && !loading) {
                  handleSendChat();
                }
              }}
              disabled={!fileName}
            />
          </div>
          {/* Send button */}
          <div
            className="relative shrink-0 size-6" data-name="mynaui:send" data-node-id="1:411"
            style={{ cursor: inputText.trim().length > 0 && !loading ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              if (inputText.trim().length > 0 && !loading) handleSendChat();
            }}
          >
            <img alt="" className="block max-w-none size-full" src={imgMynauiSend} />
          </div>
          <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_4px_0px_inset_rgba(0,0,0,0.2)]" />
        </div>
        {/* 안내 문구 */}
        <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#858585] text-[10px] text-center text-nowrap tracking-[-0.4px]" data-node-id="1:413">
          <p className="leading-[normal] whitespace-pre">{`Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요. `}</p>
        </div>
      </div>
      {
        // 채팅 내용 예시
      }
    </div>
  );
};

export default Service1;