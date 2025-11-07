import React, { useState, useRef } from 'react';
import AppLayout from './AppLayout';
import './Common.css';
import imgPrimeUpload from '../assets/figma/prime-upload.svg';
import imgMynauiSend from '../assets/figma/mynaui-send.svg';
import imgUploadLinear from '../assets/figma/upload-linear.svg';
import imgFileIcon from '../assets/figma/file-icon.png';
import imgUserAvatar from '../assets/figma/user-avatar.png';

// State types for DocChat component
type DocChatState = 'INITIAL' | 'FILE_UPLOADED' | 'CHAT_ACTIVE';

interface UploadedFile {
  name: string;
  file: File;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}


/**
 * DocChat Component - 문서 질의하기
 *
 * Three states:
 * 1. INITIAL (97-290): Initial screen with file upload panel
 * 2. FILE_UPLOADED (97-1186): File uploaded, ready for questions
 * 3. CHAT_ACTIVE (97-1264): Q&A conversation with document
 *
 * Screen transitions are handled by changing only the necessary parts,
 * not the entire screen.
 */
export default function DocChat() {
  const [state, setState] = useState<DocChatState>('INITIAL');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  // File selection handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        file
      }));
      // TODO: get paths and send to server
      const paths = Array.from(newFiles.map(f => window.electronAPI.getPathForFile(f.file)));
      const res = sendFilePathToServer(paths[0], newFiles); // Assuming single file for RAG_PATH
      if (!res) { return; }
      //alert(`RAG_PATH set to: ${paths[0]}`);
    }
  };

  // File upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Remove uploaded file
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendFilePathToServer = async (filePath: string, newFiles: UploadedFile[]) => {
    var is_sent = false;
    for (let i = 0; i < 5; i++) {
      console.log(`Sending file path to server, attempt ${i + 1}: ${filePath}`);
      try {
        const resp = await fetch('http://localhost:8000/set-rag-path/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rag_path: filePath }),
        });
        const respData = await resp.json();
        // if respData has error field, handle it accordingly
        if (respData.error) {
          console.error('Error from server:', respData.error);
          alert(`Error setting RAG_PATH: ${respData.error}`);
          return false;
        }
        const answerText = respData?.status || '응답을 가져올 수 없습니다.';
        console.log('Response from server:', answerText);
        is_sent = true;
        setUploadedFiles(prev => [...prev, ...newFiles]);
        setState('FILE_UPLOADED');
        break; // 성공 시 루프 종료
      } catch (error) {
        console.error('Error sending file path to server:', error);
        // sleep for a short time before retrying
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    if (!is_sent) {
      alert('내부 오류가 발생했습니다.');
      return false;
    }
    return true;
  };


  // Send message handler
  const handleSendMessage = async () => {
    if (!inputText.trim() || uploadedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setState('CHAT_ACTIVE');

    // Scroll to bottom
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);

    var is_sent = false;
    for (let i = 0; i < 5; i++) {
      console.log(`Sending question to server, attempt ${i + 1}: ${inputText}`);
    // TODO: Call REST API to get answer from document
    // Example API call structure:
    try {
      const formData = new FormData();
      uploadedFiles.forEach(f => formData.append('files', f.file));
      formData.append('question', inputText);

      const response = await fetch('http://localhost:8000/chat-msg/', {
        method: 'POST',
        //body: formData,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputText }),
      });

      const answerRes = await response.json();
      const answerText = answerRes?.status || '응답을 가져올 수 없습니다.';
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answerText,
      };
      setMessages(prev => [...prev, assistantMessage]);
      // Scroll to bottom
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
      is_sent = true;
      break;
    } catch (error) {
      console.error('DocChat API error:', error);
      // sleep for a short time before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
    }
    if (!is_sent) {
      alert('내부 오류가 발생했습니다.');
      return;
    }

    // MOCK: Simulate API call with timeout
    /*
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '요청하신 질문에 대한 답변입니다. 2025년 상반기에는 미래 전장 환경에 대응하기 위한 다수의 무기체계가 신규 도입 또는 개발 단계에 진입하였습니다...',
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

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        file
      }));
      const paths = Array.from(newFiles.map(f => window.electronAPI.getPathForFile(f.file)));
      const res = sendFilePathToServer(paths[0], newFiles); // Assuming single file for RAG_PATH
      if (!res) { return; }
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <AppLayout showNavigation={true} title="Chat">
      <div className="relative w-full h-full bg-[#f7f4f2]">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.hwp,.txt"
        />
        {/* "multiple" param removed from input tag for simplicity */}

        {/* LEFT PANEL - File Upload Area */}
        <div
          className={`absolute bg-white border-r border-[#cacaca] left-0 top-0 bottom-0 transition-all duration-300 ${
            isLeftPanelOpen ? 'w-[220px]' : 'w-[317px]'
          }`}
        >
          {/* UPDATED: Panel width changes from 220px to 317px */}
          <div className={`h-full overflow-clip relative transition-all duration-300 ${
            isLeftPanelOpen ? 'w-[220px]' : 'w-[317px]'
          }`}>
            {/* Panel Header */}
            {/* UPDATED: Header width changes from 180px to 277px */}
            <div className={`absolute content-stretch flex items-center justify-between left-[20px] transition-all duration-300 ${
              isLeftPanelOpen ? 'top-[21px] w-[180px]' : 'top-[30px] w-[277px]'
            }`}>
              <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-medium text-[#333333] text-[16px] text-center">
                파일 올리기
              </p>
              <div
                className="cursor-pointer"
                onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              >
                {isLeftPanelOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 3L21 21" stroke="#AFAFAF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 12L16.5 12" stroke="#AFAFAF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 19L17 12L10 5" stroke="#AFAFAF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21L3 3" stroke="#AFAFAF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12L7.5 12" stroke="#AFAFAF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 5L7 12L14 19" stroke="#AFAFAF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                )}
              </div>
            </div>

            {/* File Upload Box */}
            {/* UPDATED: Position and width changes based on panel state */}
            <div className={`absolute left-[20px] transition-all duration-300 ${
              isLeftPanelOpen ? 'top-[75px]' : 'top-[74px]'
            }`}>
              <div
                className={`box-border content-stretch flex flex-col gap-[15px] items-center p-[40px] rounded-[16px] transition-all duration-300 ${
                  isLeftPanelOpen
                    ? 'bg-[#f3f3f3] w-[180px] hover:bg-[#e8e8e8]'
                    : 'bg-[#f1f1f1] w-[277px] hover:bg-[#e5e5e5]'
                }`}
              >
                <div
                  className="content-stretch flex flex-col gap-[7px] items-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="h-[30px] w-[32px]">
                    <img alt="Upload" className="block max-w-none size-full" src={imgUploadLinear} />
                  </div>
                  <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-medium text-[#afafaf] text-[14px] text-center w-[100px]">
                    파일 끌어다 놓기
                  </p>
                </div>

                <div className="content-stretch flex gap-[18px] items-center w-[150px]">
                  <div className="h-[1px] bg-[#d9d9d9] flex-1" />
                  <p className="font-['Inter',sans-serif] font-medium text-[#d9d9d9] text-[12px] text-center">
                    or
                  </p>
                  <div className="h-[1px] bg-[#d9d9d9] flex-1" />
                </div>

                <div
                  className="bg-[#387aff] box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[6px] rounded-[5px] cursor-pointer"
                  onClick={handleUploadButtonClick}
                >
                  <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-semibold text-[14px] text-white whitespace-nowrap">
                    파일 선택하기
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Files Display */}
            {/* UPDATED: Width changes from 180px to 277px when panel expands */}
            {uploadedFiles.length > 0 && (
              <div className="absolute left-[20px] top-[303px] max-h-[400px] overflow-y-auto">
                <div className={`bg-[#f1f1f1] box-border content-stretch flex flex-col gap-[8px] p-[20px] rounded-[16px] transition-all duration-300 ${
                  isLeftPanelOpen ? 'w-[180px]' : 'w-[277px]'
                }`}>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="content-stretch flex gap-[5px] items-center w-full">
                      <div className="relative shrink-0 size-[24px]">
                        <img alt="File" className="size-full object-cover" src={imgFileIcon} />
                      </div>
                      <p className="basis-0 font-['Inter','Noto_Sans_KR',sans-serif] font-normal grow text-[14px] text-black overflow-ellipsis overflow-hidden line-clamp-1">
                        {file.name}
                      </p>
                      <div
                        className="shrink-0 size-[24px] cursor-pointer hover:opacity-70"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className={`absolute top-0 bottom-0 right-0 transition-all duration-300 ${isLeftPanelOpen ? 'left-[220px]' : 'left-[317px]'}`}>
          {messages.length === 0 ? (
            // INITIAL/FILE_UPLOADED: Show instruction message with input area below
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="content-stretch flex flex-col gap-[42px] items-center w-[600px]">
                {/* Instruction Message */}
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[32px] text-black text-center">
                  {state === 'INITIAL' ? '파일을 업로드 해주세요.' : '어떤 점이 궁금하세요?'}
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
                      disabled={uploadedFiles.length === 0}
                      className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black placeholder:text-[#858585] bg-transparent border-none outline-none flex-1 mx-[16px] disabled:opacity-50"
                    />
                    <div
                      className={`relative shrink-0 size-[24px] ${
                        uploadedFiles.length > 0 && inputText.trim()
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
                            <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start justify-center px-[16px] py-[24px] w-full">
                              <div className="content-stretch flex gap-[16px] items-center">
                                <div className="relative shrink-0 size-[32px]">
                                  <img alt="Assistant" className="block max-w-none size-full" src={imgPrimeUpload} />
                                </div>
                                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black">
                                  요청하신 질문에 대한 답변입니다.
                                </p>
                              </div>
                              <div className="h-[1px] bg-[#e0e0e0] w-full" />
                              <div className="content-stretch flex flex-col gap-[12px] items-start w-full">
                                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal leading-[24px] text-[16px] text-black w-full">
                                  {message.content}
                                </p>
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
                      disabled={uploadedFiles.length === 0}
                      className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black placeholder:text-[#858585] bg-transparent border-none outline-none flex-1 mx-[16px] disabled:opacity-50"
                    />
                    <div
                      className={`relative shrink-0 size-[24px] ${
                        uploadedFiles.length > 0 && inputText.trim()
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
      </div>
    </AppLayout>
  );
}
