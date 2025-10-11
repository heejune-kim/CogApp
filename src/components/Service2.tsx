import React, { useState, useEffect, useRef } from 'react';
import './Service2.css';
import logoLine from '../assets/figma/new-screen/logo-line.svg';
import settingsGroup from '../assets/figma/new-screen/settings-group.svg';
import frameAvatar from '../assets/figma/new-screen/frame-avatar.png';
import uploadIcon from '../assets/figma/new-screen/upload-icon.svg';

export default function Service2() {
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState<Array<{ question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendChat = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    // Add question to chat list
    setChatList(prev => [...prev, { question: inputText, answer: '' }]);
    const currentQuestion = inputText;
    setInputText('');
    // Fetch answer from API
    try {
      const response = await fetch('http://localhost:8000/chat-msg-manual/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion })
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatList]);

  const handleTitleBarDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    //alert('Title bar drag started');
    window.electronAPI?.startWindowDrag();
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="mx-auto w-[1024px]">
        <div className="service-2 bg-[#f7f4f2] h-screen flex flex-col">
          {/* Title Bar */}
          <div className="absolute bg-white h-[48px] left-0 top-0 w-full overflow-hidden drag-region"
            onMouseDown={handleTitleBarDrag}
          >
            <div className="flex gap-[5px] items-center absolute left-[20px] top-[14px]">
              <div className="relative shrink-0 w-[24px] h-[24px]">
                <img alt="Logo" className="block max-w-none w-full h-full" src={logoLine} />
              </div>
              <p className="font-normal text-[16px] text-black whitespace-nowrap">
                Galaxy on Chat
              </p>
            </div>

            {/* Window Controls */}
            <div className="absolute bg-white flex items-center left-[876px] top-[8px] no-drag-region">
              {/* Minimize Button */}
              <div className="h-[32px] w-[46px] relative shrink-0"
                style={{ cursor: 'pointer' }}
                onClick={() => window.electronAPI?.windowControl('minimize')}
              >
                <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{display: 'block'}} viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5977 16C17.5156 16 17.4375 15.987 17.3633 15.961C17.293 15.935 17.2305 15.8992 17.1758 15.8537C17.1211 15.8081 17.0781 15.7561 17.0469 15.6976C17.0156 15.6358 17 15.5707 17 15.5024C17 15.4341 17.0156 15.3707 17.0469 15.3122C17.0781 15.2504 17.1211 15.1967 17.1758 15.1512C17.2305 15.1024 17.293 15.065 17.3633 15.039C17.4375 15.013 17.5156 15 17.5977 15H28.4023C28.4844 15 28.5605 15.013 28.6309 15.039C28.7051 15.065 28.7695 15.1024 28.8242 15.1512C28.8789 15.1967 28.9219 15.2504 28.9531 15.3122C28.9844 15.3707 29 15.4341 29 15.5024C29 15.5707 28.9844 15.6358 28.9531 15.6976C28.9219 15.7561 28.8789 15.8081 28.8242 15.8537C28.7695 15.8992 28.7051 15.935 28.6309 15.961C28.5605 15.987 28.4844 16 28.4023 16H17.5977Z" fill="#979797"/>
                </svg>
              </div>
              {/* Maximize Button */}
              <div className="h-[32px] w-[46px] relative shrink-0"
                style={{ cursor: 'pointer' }}
                onClick={() => window.electronAPI?.windowControl('maximize')}
              >
                <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{display: 'block'}} viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7695 22C18.5352 22 18.3105 21.9531 18.0957 21.8594C17.8809 21.7617 17.6914 21.6328 17.5273 21.4727C17.3672 21.3086 17.2383 21.1191 17.1406 20.9043C17.0469 20.6895 17 20.4648 17 20.2305V11.7695C17 11.5352 17.0469 11.3105 17.1406 11.0957C17.2383 10.8809 17.3672 10.6934 17.5273 10.5332C17.6914 10.3691 17.8809 10.2402 18.0957 10.1465C18.3105 10.0488 18.5352 10 18.7695 10H27.2305C27.4648 10 27.6895 10.0488 27.9043 10.1465C28.1191 10.2402 28.3066 10.3691 28.4668 10.5332C28.6309 10.6934 28.7598 10.8809 28.8535 11.0957C28.9512 11.3105 29 11.5352 29 11.7695V20.2305C29 20.4648 28.9512 20.6895 28.8535 20.9043C28.7598 21.1191 28.6309 21.3086 28.4668 21.4727C28.3066 21.6328 28.1191 21.7617 27.9043 21.8594C27.6895 21.9531 27.4648 22 27.2305 22H18.7695ZM27.2012 20.7988C27.2832 20.7988 27.3594 20.7832 27.4297 20.752C27.5039 20.7207 27.5684 20.6777 27.623 20.623C27.6777 20.5684 27.7207 20.5059 27.752 20.4355C27.7832 20.3613 27.7988 20.2832 27.7988 20.2012V11.7988C27.7988 11.7168 27.7832 11.6406 27.752 11.5703C27.7207 11.4961 27.6777 11.4316 27.623 11.377C27.5684 11.3223 27.5039 11.2793 27.4297 11.248C27.3594 11.2168 27.2832 11.2012 27.2012 11.2012H18.7988C18.7168 11.2012 18.6387 11.2168 18.5645 11.248C18.4941 11.2793 18.4316 11.3223 18.377 11.377C18.3223 11.4316 18.2793 11.4961 18.248 11.5703C18.2168 11.6406 18.2012 11.7168 18.2012 11.7988V20.2012C18.2012 20.2832 18.2168 20.3613 18.248 20.4355C18.2793 20.5059 18.3223 20.5684 18.377 20.623C18.4316 20.6777 18.4941 20.7207 18.5645 20.752C18.6387 20.7832 18.7168 20.7988 18.7988 20.7988H27.2012Z" fill="#979797"/>
                </svg>
              </div>
              {/* Close Button */}
              <div className="h-[32px] w-[46px] relative shrink-0"
                style={{ cursor: 'pointer' }}
                onClick={() => window.electronAPI?.windowControl('close')}
              >
                <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{display: 'block'}} viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 16.8496L18.0254 21.8242C17.9082 21.9414 17.7676 22 17.6035 22C17.4316 22 17.2871 21.9434 17.1699 21.8301C17.0566 21.7129 17 21.5684 17 21.3965C17 21.2324 17.0586 21.0918 17.1758 20.9746L22.1504 16L17.1758 11.0254C17.0586 10.9082 17 10.7656 17 10.5977C17 10.5156 17.0156 10.4375 17.0469 10.3633C17.0781 10.2891 17.1211 10.2266 17.1758 10.1758C17.2305 10.1211 17.2949 10.0781 17.3691 10.0469C17.4434 10.0156 17.5215 10 17.6035 10C17.7676 10 17.9082 10.0586 18.0254 10.1758L23 15.1504L27.9746 10.1758C28.0918 10.0586 28.2344 10 28.4023 10C28.4844 10 28.5605 10.0156 28.6309 10.0469C28.7051 10.0781 28.7695 10.1211 28.8242 10.1758C28.8789 10.2305 28.9219 10.2949 28.9531 10.3691C28.9844 10.4395 29 10.5156 29 10.5977C29 10.7656 28.9414 10.9082 28.8242 11.0254L23.8496 16L28.8242 20.9746C28.9414 21.0918 29 21.2324 29 21.3965C29 21.4785 28.9844 21.5566 28.9531 21.6309C28.9219 21.7051 28.8789 21.7695 28.8242 21.8242C28.7734 21.8789 28.7109 21.9219 28.6367 21.9531C28.5625 21.9844 28.4844 22 28.4023 22C28.2344 22 28.0918 21.9414 27.9746 21.8242L23 16.8496Z" fill="#979797"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="absolute bg-white flex h-[44px] items-center justify-between left-0 px-[20px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] top-[48px] w-full">
            <div className="flex items-center justify-center shrink-0">
              <div className="rotate-180">
                <div className="relative w-[24px] h-[24px]">
                  <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{display: 'block'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 6H20.25M3.75 12H20.25M3.75 18H20.25" stroke="#909090" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0">
              <div className="rotate-180">
                <div className="overflow-hidden relative w-[24px] h-[24px]">
                  <div className="absolute inset-[9.37%]">
                    <div className="absolute inset-[-3.59%]">
                      <img alt="Settings" className="block max-w-none w-full h-full" src={settingsGroup} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === 상단 인사(고정) + 대화영역(스크롤) === */}
          <div className="absolute left-[20px] right-[20px] top-[132px] bottom-[120px]">
            <div className="flex flex-col h-full min-h-0">
              {/* 인사 문구: 스크롤 안 함 */}
              <div className="shrink-0 mb-[16px]">
                <p className="font-normal text-[32px] leading-[40px] text-black">안녕하세요, JD님.</p>
                <p className="font-normal text-[32px] leading-[40px] text-black">번역할 내용을 입력해주세요.</p>
              </div>

              {/* 대화 영역: 여기만 세로 스크롤 */}
              <div
                ref={chatContainerRef}
                className="grow overflow-y-auto overflow-x-hidden pr-[2px] pb-[8px]"
              >
                {chatList.map((chat, index) => (
                  <React.Fragment key={index}>
                    {/* 사용자 메시지 */}
                    <div className="flex gap-[16px] items-start w-full">
                      <div className="overflow-hidden relative rounded-[16px] shrink-0 w-[32px] h-[32px]">
                        <img alt="User Avatar" className="absolute max-w-none object-cover rounded-[16px] w-full h-full" src={frameAvatar} />
                      </div>
                      <p className="flex-1 font-normal leading-[24px] text-[16px] text-black">
                        {chat.question}
                      </p>
                    </div>

                    {/* AI 응답 */}
                    <div className="bg-white flex flex-col gap-[16px] items-start w-full overflow-hidden px-[16px] py-[24px] rounded-[24px]">
                      <div className="flex gap-[16px] items-start w-full">
                        <div className="relative shrink-0 w-[32px] h-[32px]">
                          <img alt="AI Icon" className="block max-w-none w-full h-full" src={uploadIcon} />
                        </div>
                        <p className="flex-1 font-normal leading-[24px] text-[16px] text-black">
                          {chat.answer || (loading && index === chatList.length - 1 ? '답변을 불러오는 중...' : '')}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="absolute bottom-[20px] flex flex-col gap-[8px] items-center left-[20px] w-[984px]">
            <div className="bg-white flex items-center justify-between overflow-hidden px-[20px] py-[8px] rounded-full w-full shadow-[0px_0px_4px_0px_inset_rgba(0,0,0,0.2)]">
              <div className="relative shrink-0 w-[32px] h-[32px]">
                <img alt="Upload" className="block max-w-none w-full h-full" src={uploadIcon} />
              </div>

              {/* Input text */}
              <div className="basis-0 font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-black" data-node-id="1:410">
                <input
                  className="w-full outline-none"
                  placeholder="사용자 가이드 내용 중 무엇이든 물어보세요..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && inputText.trim().length > 0 && !loading) {
                      handleSendChat();
                    }
                  }}
                />
              </div>
    
              {/* Send Button */} 
              <div className="relative shrink-0 w-[24px] h-[24px]"
                style={{ cursor: inputText.trim().length > 0 && !loading ? 'pointer' : 'not-allowed' }}
                onClick={() => {
                  if (inputText.trim().length > 0 && !loading) handleSendChat();
                }}
              >
                <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{display: 'block'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="white"/>
                  <path d="M14 10L11 13M20.288 3.031C20.3829 2.99825 20.4851 2.99287 20.5829 3.01545C20.6807 3.03803 20.7702 3.08768 20.8411 3.15871C20.912 3.22974 20.9615 3.3193 20.984 3.41714C21.0064 3.51498 21.0009 3.61716 20.968 3.712L15.044 20.642C15.0086 20.7432 14.9435 20.8314 14.8573 20.8952C14.7711 20.959 14.6677 20.9954 14.5606 20.9997C14.4534 21.004 14.3475 20.976 14.2564 20.9194C14.1654 20.8627 14.0935 20.78 14.05 20.682L10.831 13.44C10.7768 13.3196 10.6804 13.2232 10.56 13.169L3.318 9.949C3.22029 9.90538 3.13792 9.83346 3.0815 9.74253C3.02509 9.65161 2.99724 9.54586 3.00155 9.43895C3.00585 9.33203 3.04212 9.22887 3.10566 9.14277C3.16921 9.05668 3.2571 8.99162 3.358 8.956L20.288 3.031Z" stroke="#428DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <p className="font-normal text-[#858585] text-[10px] text-center whitespace-nowrap tracking-[-0.4px]">
              Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

