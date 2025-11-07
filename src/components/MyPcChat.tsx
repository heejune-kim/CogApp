import React, { useState, useRef } from 'react';
import AppLayout from './AppLayout';
import './Common.css';
import imgPrimeUpload from '../assets/figma/prime-upload.svg';
import imgMynauiSend from '../assets/figma/mynaui-send.svg';
import imgUserAvatar from '../assets/figma/user-avatar.png';

// State types for MyPcChat component
type MyPcChatState = 'INITIAL' | 'CHAT_ACTIVE';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  title?: string; // For assistant messages
}

/**
 * MyPcChat Component - 내 PC 질의하기
 *
 * Two states:
 * 1. INITIAL (97-407): Initial screen with prompt message
 * 2. CHAT_ACTIVE (97-446): Q&A conversation about PC
 *
 * Features:
 * - Chat with AI about PC-related questions
 * - Formatted responses with proper structure
 * - Scrollable conversation history
 */
export default function MyPcChat() {
  const [state, setState] = useState<MyPcChatState>('INITIAL');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const updateLastChatMessage = (newContent: string, newTitle: string | null) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      const lastIndex = updatedMessages.length - 1;
      if (lastIndex >= 0 && updatedMessages[lastIndex].role === 'assistant') {
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          content: newContent,
        };
        if (newTitle !== null) {
          updatedMessages[lastIndex].title = newTitle;
        }
      }
      return updatedMessages;
    });
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setState('CHAT_ACTIVE');

    const waitMessage: ChatMessage = {
      role: 'assistant',
      content: '답변을 준비 중입니다...',
      title: '잠시만 기다려주세요.',
    };
    setMessages(prev => [...prev, waitMessage]);

    // Scroll to bottom
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);

    var is_sent = false;
    for (let i = 0; i < 5; i++) {
      console.log(`Sending question to MyPcChat API, attempt ${i + 1}: ${inputText}`);
      // TODO: Call REST API to get answer about PC
      // Example API call structure:
      try {
        const response = await fetch('http://localhost:8000/chat-msg-manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: inputText }),
        });

        const answerRes = await response.json();
        const answerText = answerRes?.status || '응답을 가져올 수 없습니다.';
        const answerTitle = answerRes?.title || '알 수 없음';
        updateLastChatMessage(answerText, answerTitle);
        /*
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: answerText,
          title: answerTitle,
        };
        setMessages(prev => [...prev, assistantMessage]);
        */
        // Scroll to bottom
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
        is_sent = true;
        break; // 성공 시 루프 종료
      } catch (error) {
        console.error('MyPcChat API error:', error);
        updateLastChatMessage(`응답을 가져올 수 없습니다. ${i + 1}회 재시도 / 5`, '응답없음');
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
        // 잠시 대기 후 재시도
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    if (!is_sent) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        title: '오류',
        content: '죄송합니다. 나중에 다시 시도해주세요.',
      };
      setMessages(prev => [...prev, errorMessage]);
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }

    /*
    // MOCK: Simulate API call with timeout
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        title: 'Windows 노트북 사양 확인 방법',
        content: `가. 시스템 정보 (가장 상세하고 일반적)
1. Windows 키 + R 을 눌러 '실행' 창을 엽니다.
2. msinfo32 를 입력하고 Enter 키를 누르거나 '확인'을 클릭합니다.
3. '시스템 정보' 창이 열리면 CPU, RAM, 운영체제 버전, 시스템 모델 등 자세한 정보를 확인할 수 있습니다.

나. 설정 앱을 통한 확인 (간편)
1. Windows 키 + I 를 눌러 '설정' 앱을 엽니다.
2. '시스템' -> '정보' 로 이동합니다.
3. 여기서 프로세서(CPU), 설치된 RAM, 시스템 종류(64비트/32비트), Windows 버전 및 에디션 등의 정보를 확인할 수 있습니다.

다. 작업 관리자를 통한 확인 (실시간 성능 및 간단 정보)
1. Ctrl + Shift + Esc 를 동시에 눌러 '작업 관리자'를 엽니다.
2. '성능' 탭으로 이동합니다.
3. 왼쪽 메뉴에서 CPU, 메모리(RAM), 디스크, GPU 등을 선택하면 각 하드웨어의 사용률과 함께 기본적인 사양을 확인할 수 있습니다.`,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Scroll to bottom
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }, 1000);
    */
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <AppLayout showNavigation={true} title="Chat">
      <div className="relative w-full h-full bg-[#f7f4f2]">
        {messages.length === 0 ? (
          // INITIAL: Show instruction message with input area below
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="content-stretch flex flex-col gap-[42px] items-center w-[600px]">
              {/* Instruction Message */}
              <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[32px] text-black text-center">
                내 PC에서 궁금하신 점을 물어보세요.
              </p>

              {/* Input Area */}
              <div className="content-stretch flex flex-col gap-[8px] items-center w-full">
                <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[8px] rounded-[9999px] w-full">
                  <div className="relative shrink-0 size-[32px]">
                    <img alt="Upload" className="block max-w-none size-full" src={imgPrimeUpload} />
                  </div>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="텍스트를 입력해주세요."
                    className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black placeholder:text-[#858585] bg-transparent border-none outline-none flex-1 mx-[16px]"
                  />
                  <div
                    className={`relative shrink-0 size-[24px] ${
                      inputText.trim()
                        ? 'cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={handleSendMessage}
                  >
                    <img alt="Send" className="block max-w-none size-full" src={imgMynauiSend} />
                  </div>
                </div>
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[#858585] text-[10px] text-center tracking-[-0.4px]">
                  Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // CHAT_ACTIVE: Show conversation with input at bottom
          <div className="relative w-full h-full flex flex-col">
            {/* Chat Messages Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto scrollable-chat-content flex justify-center py-[40px]"
            >
              <div className="w-full max-w-[600px] px-[20px]">
                <div className="content-stretch flex flex-col gap-[40px] w-full">
                  {messages.map((message, index) => (
                    <div key={index} className="w-full">
                      {message.role === 'user' ? (
                        // User Message
                        <div className="content-stretch flex gap-[16px] items-center justify-end">
                          <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black text-right max-w-[500px]">
                            {message.content}
                          </p>
                          <div className="overflow-clip rounded-[16px] shrink-0 size-[32px]">
                            <img alt="User" className="size-full object-cover" src={imgUserAvatar} />
                          </div>
                        </div>
                      ) : (
                        // Assistant Message
                        <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip rounded-[24px] w-full">
                          <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start px-[16px] py-[24px] w-full">
                            <div className="content-stretch flex gap-[16px] items-center">
                              <div className="relative shrink-0 size-[32px]">
                                <img alt="Assistant" className="block max-w-none size-full" src={imgPrimeUpload} />
                              </div>
                              {message.title && (
                                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal leading-[24px] text-[16px] text-black">
                                  {message.title}
                                </p>
                              )}
                            </div>

                            <div className="h-[1px] bg-[#e0e0e0] w-full" />

                            <div className="content-stretch flex flex-col gap-[12px] items-start w-full">
                              <div className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black w-full whitespace-pre-line leading-[24px]">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="flex justify-center pb-[40px] px-[20px]">
              <div className="content-stretch flex flex-col gap-[8px] items-center w-full max-w-[600px]">
                <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[8px] rounded-[9999px] w-full">
                  <div className="relative shrink-0 size-[32px]">
                    <img alt="Upload" className="block max-w-none size-full" src={imgPrimeUpload} />
                  </div>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="텍스트를 입력해주세요."
                    className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black placeholder:text-[#858585] bg-transparent border-none outline-none flex-1 mx-[16px]"
                  />
                  <div
                    className={`relative shrink-0 size-[24px] ${
                      inputText.trim()
                        ? 'cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={handleSendMessage}
                  >
                    <img alt="Send" className="block max-w-none size-full" src={imgMynauiSend} />
                  </div>
                </div>
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[#858585] text-[10px] text-center tracking-[-0.4px]">
                  Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
