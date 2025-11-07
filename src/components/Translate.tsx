import React, { useState, useRef, useEffect } from 'react';
import AppLayout from './AppLayout';
import './Common.css';
import imgPrimeUpload from '../assets/figma/prime-upload.svg';
import imgMynauiSend from '../assets/figma/mynaui-send.svg';
import imgKoreaFlag from '../assets/figma/korea-flag.png';
import imgUsaFlag from '../assets/figma/usa-flag.png';
import imgSwitchIcon from '../assets/figma/switch-icon.svg';
import imgUserAvatar from '../assets/figma/user-avatar.png';

// Translation state types
type TranslateState = 'INITIAL' | 'INPUT_ACTIVE' | 'TRANSLATED';

interface TranslationPair {
  original: string;
  // translated can be null if translation failed
  translated: string | null;
  fromLang: string;
  toLang: string;
}

/**
 * Translate Component - 번역하기
 *
 * Three states:
 * 1. INITIAL (97-360): Initial screen with empty input
 * 2. INPUT_ACTIVE (97-567): User typing, input expands with content
 * 3. TRANSLATED (97-615): Shows translation result
 *
 * Features:
 * - Auto-expanding textarea based on content
 * - Language selection (Korean ↔ English)
 * - Translation history display
 */
export default function Translate() {
  const [state, setState] = useState<TranslateState>('INITIAL');
  const [inputText, setInputText] = useState('');
  const [translations, setTranslations] = useState<TranslationPair[]>([]);
  const [fromLang, setFromLang] = useState<'KO' | 'EN'>('KO');
  const [toLang, setToLang] = useState<'KO' | 'EN'>('EN');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ========================================
  // AUTO-EXPAND TEXTAREA
  // ========================================

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (e.target.value.trim().length > 0) {
      setState('INPUT_ACTIVE');
    } else {
      setState('INITIAL');
    }
  };

  // Switch languages
  const handleSwitchLanguages = () => {
    setFromLang(prev => prev === 'KO' ? 'EN' : 'KO');
    setToLang(prev => prev === 'KO' ? 'EN' : 'KO');
  };

  const updateLastTranslation = (translatedText: string | null) => {
    setTranslations(prev => {
      const lastTranslation = prev[prev.length - 1];
      if (lastTranslation) {
        lastTranslation.translated = translatedText;
      }
      return [...prev];
    });
  };

  // Send translation request
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setInputText('');
    var newTranslation: TranslationPair = {
      original: inputText,
      translated: null,
      fromLang: lang_code_to_name(fromLang),
      toLang: lang_code_to_name(toLang),
    };
    setTranslations(prev => [...prev, newTranslation]);

    var is_sent = false;
    for (let i = 0; i < 5; i++) {
      console.log(`Translating text, attempt ${i + 1}: ${inputText}`);
        // TODO: Call REST API for translation
        // Example API call structure:
      try {
        const response = await fetch('http://localhost:8000/chat-msg-translate/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // send text as base64 encoded because quot and double quot
            text: inputText, // to base64 encode if needed
            from_lang: fromLang,
            to_lang: toLang,
          }),
        });

        const answerRes = await response.json();
        const answerText = answerRes?.status || '응답을 가져올 수 없습니다.';
        newTranslation.translated = answerText;
        /*
        const newTranslation: TranslationPair = {
          original: inputText,
          translated: answerText,
          fromLang: lang_code_to_name(fromLang),
          toLang: lang_code_to_name(toLang),
        };
        */
        // Update the last translation entry with the translated text
        updateLastTranslation(answerText);
        setState('TRANSLATED');

        // Scroll to bottom
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
        is_sent = true;
        break;
      } catch (error) {
        console.error('Translation API error:', error);
        newTranslation.translated = "내부 오류가 발생하여 번역할 수 없습니다. 5초 후에 다시 시도합니다.\n" +
          "(Translation service is temporarily unavailable due to an internal error. " +
          "Retrying in 5 seconds.)\n" + `Retry attempt ${i + 1}/5.`;
        updateLastTranslation(newTranslation.translated);
        // sleep for a short time before retrying
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    if (!is_sent) {
      updateLastTranslation("내부 오류가 발생하여 번역할 수 없습니다. 잠시 후에 다시 시도해주세요.\n" +
        "(Translation service is temporarily unavailable due to an internal error. " +
        "Please try again later.)");
      alert('내부 오류가 발생했습니다.');
      return;
    }

    /*
    // MOCK: Simulate translation
    setTimeout(() => {
      const mockTranslation = fromLang === 'KR'
        ? 'Hello. Tap the screen to start the service. To ensure smooth use, please select your language first...'
        : '안녕하세요. 서비스를 시작하시려면 화면을 눌러주세요. 원활한 사용을 위해 언어를 먼저 선택해 주세요...';

      const newTranslation: TranslationPair = {
        original: inputText,
        translated: mockTranslation,
        fromLang: fromLang === 'KR' ? '한국어' : 'English',
        toLang: toLang === 'KR' ? '한국어' : 'English',
      };

      setTranslations(prev => [...prev, newTranslation]);
      setInputText('');
      setState('TRANSLATED');

      // Scroll to bottom
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }, 1000);
    */
  };

  // Handle Enter key (Shift+Enter for new line, Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <AppLayout showNavigation={true} title="Chat">
      <div className="relative w-full h-full bg-[#f7f4f2]">
        {translations.length === 0 ? (
          // INITIAL: Show instruction message with input area below
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="content-stretch flex flex-col gap-[42px] items-center w-[600px]">
              {/* Instruction Message */}
              <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[32px] text-black text-center">
                번역할 내용을 입력해주세요.
              </p>

              {/* Input Area */}
              <div className="content-stretch flex flex-col gap-[8px] items-center w-full">
                {/* Input Box with Language Selector */}
                <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip px-[20px] py-[8px] rounded-[30px] w-full">
                  <div className="content-stretch flex gap-[16px] items-center w-full">
                    {/* Language Selector */}
                    <div className="bg-white border border-[#cacaca] box-border content-stretch flex gap-[10px] items-center p-[10px] rounded-[30px]">
                      <div className="overflow-clip rounded-[32px] shrink-0 size-[24px]">
                        <img
                          alt={fromLang === 'KO' ? 'Korean' : 'English'}
                          className="size-full object-cover"
                          src={fromLang === 'KO' ? imgKoreaFlag : imgUsaFlag}
                        />
                      </div>
                      <div
                        className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-70"
                        onClick={handleSwitchLanguages}
                      >
                        <img alt="Switch" className="block max-w-none size-full" src={imgSwitchIcon} />
                      </div>
                      <div className="overflow-clip rounded-[32px] shrink-0 size-[24px]">
                        <img
                          alt={toLang === 'KO' ? 'Korean' : 'English'}
                          className="size-full object-cover"
                          src={toLang === 'KO' ? imgKoreaFlag : imgUsaFlag}
                        />
                      </div>
                    </div>

                    {/* Auto-expanding Textarea */}
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="텍스트를 입력해주세요."
                      className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black placeholder:text-[#858585] bg-transparent border-none outline-none flex-1 resize-none overflow-hidden min-h-[24px] max-h-[200px] auto-expand-textarea"
                      rows={1}
                    />

                    {/* Send Button */}
                    <div
                      className={`relative shrink-0 size-[24px] ${
                        inputText.trim()
                          ? 'cursor-pointer hover:opacity-70'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={handleTranslate}
                    >
                      <img alt="Send" className="block max-w-none size-full" src={imgMynauiSend} />
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[#858585] text-[10px] text-center tracking-[-0.4px]">
                  Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // TRANSLATED: Show translation history with input at bottom
          <div className="relative w-full h-full flex flex-col">
            {/* Translation Results Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto scrollable-chat-content flex justify-center py-[40px]"
            >
              <div className="w-full max-w-[600px] px-[20px]">
                {/* Translation History */}
                <div className="content-stretch flex flex-col gap-[40px] w-full">
                  {translations.map((trans, index) => (
                    <div key={index} className="content-stretch flex flex-col gap-[16px] w-full">
                      {/* Original Text (User) */}
                      <div className="content-stretch flex gap-[16px] items-start justify-end w-full">
                        <p className="basis-0 font-['Inter','Noto_Sans_KR',sans-serif] font-normal grow leading-[24px] text-[16px] text-black text-right max-w-[520px]">
                          {trans.original}
                        </p>
                        <div className="overflow-clip rounded-[16px] shrink-0 size-[32px]">
                          <img alt="User" className="size-full object-cover" src={imgUserAvatar} />
                        </div>
                      </div>

                      {/* Translated Text (Assistant) */}
                      {trans.translated && (
                      <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start justify-center px-[16px] py-[24px] rounded-[24px] w-full">
                        <div className="content-stretch flex gap-[16px] items-center w-full">
                          <div className="relative shrink-0 size-[32px]">
                            <img alt="Assistant" className="block max-w-none size-full" src={imgPrimeUpload} />
                          </div>
                          <p className="basis-0 font-['Inter','Noto_Sans_KR',sans-serif] font-normal grow text-[16px] text-black">
                            입력하신 텍스트를 {trans.fromLang}→{trans.toLang}로 번역했습니다.
                          </p>
                        </div>

                        <div className="h-[1px] bg-[#e0e0e0] w-full" />

                        <div className="content-stretch flex flex-col gap-[12px] items-start w-full">
                          <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[20px] text-black">
                            번역내용
                          </p>
                          <p className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal leading-[24px] text-[16px] text-black w-full">
                            {trans.translated}
                          </p>
                        </div>
                      </div>)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="flex justify-center pb-[40px] px-[20px]">
              <div className="content-stretch flex flex-col gap-[8px] items-center w-full max-w-[600px]">
                {/* Input Box with Language Selector */}
                <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip px-[20px] py-[8px] rounded-[30px] w-full">
                  <div className="content-stretch flex gap-[16px] items-center w-full">
                    {/* Language Selector */}
                    <div className="bg-white border border-[#cacaca] box-border content-stretch flex gap-[10px] items-center p-[10px] rounded-[30px]">
                      <div className="overflow-clip rounded-[32px] shrink-0 size-[24px]">
                        <img
                          alt={fromLang === 'KO' ? 'Korean' : 'English'}
                          className="size-full object-cover"
                          src={fromLang === 'KO' ? imgKoreaFlag : imgUsaFlag}
                        />
                      </div>
                      <div
                        className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-70"
                        onClick={handleSwitchLanguages}
                      >
                        <img alt="Switch" className="block max-w-none size-full" src={imgSwitchIcon} />
                      </div>
                      <div className="overflow-clip rounded-[32px] shrink-0 size-[24px]">
                        <img
                          alt={toLang === 'KO' ? 'Korean' : 'English'}
                          className="size-full object-cover"
                          src={toLang === 'KO' ? imgKoreaFlag : imgUsaFlag}
                        />
                      </div>
                    </div>

                    {/* Auto-expanding Textarea */}
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="텍스트를 입력해주세요."
                      className="font-['Inter','Noto_Sans_KR',sans-serif] font-normal text-[16px] text-black placeholder:text-[#858585] bg-transparent border-none outline-none flex-1 resize-none overflow-hidden min-h-[24px] max-h-[200px] auto-expand-textarea"
                      rows={1}
                    />

                    {/* Send Button */}
                    <div
                      className={`relative shrink-0 size-[24px] ${
                        inputText.trim()
                          ? 'cursor-pointer hover:opacity-70'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={handleTranslate}
                    >
                      <img alt="Send" className="block max-w-none size-full" src={imgMynauiSend} />
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
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
function lang_code_to_name(langCode: string): string {
  switch (langCode) {
    case 'KO':
      return '한국어';
    case 'EN':
      return '영어';
    default:
      return langCode;
  }
}

