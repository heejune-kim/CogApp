import React, { useState, useRef } from 'react';
import AppLayout from './AppLayout';
import './Common.css';
import imgPrimeUpload from '../assets/figma/prime-upload.svg';
import imgUploadLinear from '../assets/figma/upload-linear.svg';
import imgFileIcon from '../assets/figma/file-icon.png';

// State types for DocSummary component
type DocSummaryState = 'INITIAL' | 'PROCESSING' | 'COMPLETED';

interface UploadedFile {
  name: string;
  file: File;
}


/**
 * DocSummary Component - 문서 요약하기
 *
 * Three states:
 * 1. INITIAL (97-229): Initial screen with file upload area
 * 2. PROCESSING (97-752): Shows "요약중..." while waiting for API response
 * 3. COMPLETED (97-862): Shows summary result
 *
 * Screen transitions are handled by changing only the necessary parts,
 * not the entire screen.
 */
export default function DocSummary() {
  const [state, setState] = useState<DocSummaryState>('INITIAL');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const sendFilePathToServer = async (filePath: string) => {
    setState('PROCESSING');
    try {
      const request = await fetch('http://localhost:8000/summarize/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rag_path: filePath }),
      });
      const answerRes = await request.json();
      const answerText = answerRes?.status || '응답을 가져올 수 없습니다.';
      setSummaryResult(answerText);
      setState('COMPLETED');
    } catch (error) {
      console.error('Summary API error:', error);
      setState('INITIAL');
    }
  };


  // File selection handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile({ name: file.name, file });

      const paths = Array.from(Array.from(files).map(f => window.electronAPI.getPathForFile(f)));
      sendFilePathToServer(paths[0]); // Assuming single file for RAG_PATH
    }
  };

  // File upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start summary process
  const handleStartSummary = async () => {
    if (!uploadedFile) return;

    // Transition to PROCESSING state
    setState('PROCESSING');

    // TODO: Call REST API to process summary
    // Example API call structure:
    try {
      //const formData = new FormData();
      //formData.append('file', uploadedFile.file);

      const response = await fetch('http://localhost:8000/summarize/', {
        method: 'POST',
        //body: formData,
        body: JSON.stringify({ question: 'Summarize the document.' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const answerRes = await response.json();
      const answerText = answerRes?.status || '응답을 가져올 수 없습니다.';
      setSummaryResult(answerText);
      setState('COMPLETED');
    } catch (error) {
      console.error('Summary API error:', error);
      setState('INITIAL');
    }

    /*
    // MOCK: Simulate API call with timeout
    setTimeout(() => {
      setSummaryResult('이 문서는 2025년 상반기 무기체계에 관한 내용을 담고 있습니다. 주요 내용으로는...');
      setState('COMPLETED');
    }, 2000);
    */
  };

  // Drag and drop handlers (TODO: implement drag and drop functionality)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile({ name: file.name, file });
      const paths = Array.from(Array.from(files).map(f => window.electronAPI.getPathForFile(f)));
      sendFilePathToServer(paths[0]); // Assuming single file for RAG_PATH
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

        {/* LEFT PANEL - File Upload Area */}
        <div
          className={`absolute bg-white border-r border-[#cacaca] left-0 top-0 bottom-0 transition-all duration-300 ${
            isLeftPanelOpen ? 'w-[220px]' : 'w-[317px]'
            //isLeftPanelOpen ? 'w-[220px]' : 'w-0 overflow-hidden'
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
 
                {/*
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform ${isLeftPanelOpen ? 'rotate-0' : 'rotate-180'}`}>
                  <path d="M9 6L15 12L9 18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                */}
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
                  <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-semibold text-[14px] text-white">
                    파일 선택하기
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded File Display */}
            {/* UPDATED: Width changes from 180px to 277px when panel expands */}
            {uploadedFile && (
              <div className="absolute left-[20px] top-[303px]">
                <div className={`bg-[#f1f1f1] box-border content-stretch flex gap-[10px] items-center p-[20px] rounded-[16px] transition-all duration-300 ${
                  isLeftPanelOpen ? 'w-[180px]' : 'w-[277px]'
                }`}>
                  <div className="basis-0 content-stretch flex flex-col gap-[8px] grow min-h-px min-w-px overflow-clip">
                    <div className="content-stretch flex gap-[5px] items-center w-full">
                      <div className="relative shrink-0 size-[24px]">
                        <img alt="File" className="size-full object-cover" src={imgFileIcon} />
                      </div>
                      <p className="basis-0 font-['Inter','Noto_Sans_KR',sans-serif] font-normal grow text-[14px] text-black overflow-ellipsis overflow-hidden line-clamp-1">
                        {uploadedFile.name}
                      </p>
                      <div
                        className="shrink-0 size-[24px] cursor-pointer hover:opacity-70"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className={`absolute top-0 bottom-0 right-0 transition-all duration-300 ${isLeftPanelOpen ? 'left-[220px]' : 'left-[317px]'}`}>
          <div className="relative w-full h-full px-[102px] py-[40px]">
            {/* STATE: INITIAL - Show instruction message */}
            {state === 'INITIAL' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[32px] text-black mb-[24px]">
                    파일을 작업창에 업로드 해주세요.
                  </p>
                  {/*
                    uploadedFile && (
                    <button
                      onClick={handleStartSummary}
                      className="bg-[#387aff] text-white font-['Inter','Noto_Sans_KR',sans-serif] font-semibold text-[16px] px-[32px] py-[12px] rounded-[9999px] hover:bg-[#2868dd] transition-colors cursor-pointer"
                    >
                      요약 시작하기
                    </button>
                    )
                  */}
                </div>
              </div>
            )}

            {/* STATE: PROCESSING - Show loading message */}
            {state === 'PROCESSING' && (
              <div className="content-stretch flex flex-col gap-[40px] items-center pt-[40px]">
                <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip rounded-[24px] w-full max-w-[600px]">
                  <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start justify-center px-[16px] py-[24px] w-full">
                    <div className="content-stretch flex gap-[16px] items-center">
                      <div className="relative shrink-0 size-[32px]">
                        <img alt="Processing" className="block max-w-none size-full animate-pulse" src={imgPrimeUpload} />
                      </div>
                      <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black">
                        요약중...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STATE: COMPLETED - Show summary result */}
            {state === 'COMPLETED' && (
              <div className="content-stretch flex flex-col gap-[40px] items-start scrollable-chat-content h-full overflow-y-auto px-[20px]">
                <div className="content-stretch flex flex-col gap-[10px] items-start w-full max-w-[600px]">
                  <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start justify-center px-[16px] py-[24px] rounded-[24px] w-full">
                    <div className="content-stretch flex gap-[16px] items-start">
                      <div className="relative shrink-0 size-[32px]">
                        <img alt="File" className="block max-w-none size-full" src={imgPrimeUpload} />
                      </div>
                      <div className="flex-1">
                        <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-medium text-[16px] text-black mb-[8px]">
                          요약 결과
                        </p>
                        <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[14px] text-[#333] leading-[1.6]">
                          {summaryResult}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Summary Button */}
                {/*
                <button
                  onClick={() => {
                    setState('INITIAL');
                    setSummaryResult('');
                    setUploadedFile(null);
                  }}
                  className="bg-white border border-[#387aff] text-[#387aff] font-['Inter','Noto_Sans_KR',sans-serif] font-semibold text-[14px] px-[24px] py-[10px] rounded-[9999px] hover:bg-[#f0f7ff] transition-colors cursor-pointer"
                >
                  새로운 요약하기
                </button>
                */}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
