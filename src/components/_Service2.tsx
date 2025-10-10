import React from 'react';

export default function _Service2() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-[1024px]">
        <div className="bg-[#f7f4f2] relative h-screen">
          {/* Title Bar */}
          <div className="absolute bg-white h-[48px] left-0 top-0 w-full overflow-hidden">
            <div className="flex gap-[5px] items-center absolute left-[20px] top-[14px]">
              <div className="relative shrink-0 w-[24px] h-[24px]">
                <img alt="Logo" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/logo-line.svg" />
              </div>
              <p className="font-['Inter',_sans-serif] font-normal text-[16px] text-black whitespace-nowrap">
                Galaxy on Chat
              </p>
            </div>
          </div>

          {/* Window Controls */}
          <div className="absolute bg-white flex items-center left-[876px] top-[8px]">
            <div className="h-[32px] w-[46px] relative shrink-0">
              <img alt="Minimize" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/minimize-btn.svg" />
            </div>
            <div className="h-[32px] w-[46px] relative shrink-0">
              <img alt="Maximize" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/maximize-btn.svg" />
            </div>
            <div className="h-[32px] w-[46px] relative shrink-0">
              <img alt="Close" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/close-btn.svg" />
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="absolute bg-white flex h-[44px] items-center justify-between left-0 px-[20px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] top-[48px] w-full">
            <div className="flex items-center justify-center shrink-0">
              <div className="rotate-180">
                <div className="relative w-[24px] h-[24px]">
                  <img alt="Menu" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/hamburger.svg" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0">
              <div className="rotate-180">
                <div className="overflow-hidden relative w-[24px] h-[24px]">
                  <div className="absolute inset-[9.37%]">
                    <div className="absolute inset-[-3.59%]">
                      <img alt="Settings" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/settings-group.svg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="absolute flex flex-col gap-[42px] items-start left-[20px] top-[132px] w-[982px]">
            <div className="font-['Inter',_'Noto_Sans_KR',_sans-serif] font-normal text-[32px] text-black whitespace-pre-line">
              <p className="mb-0">안녕하세요, JD님.</p>
              <p>번역할 내용을 입력해주세요.</p>
            </div>
          </div>

          {/* User Message */}
          <div className="absolute flex gap-[16px] items-start left-[20px] top-[250px] w-[982px]">
            <div className="overflow-hidden relative rounded-[16px] shrink-0 w-[32px] h-[32px]">
              <div className="absolute inset-0 pointer-events-none rounded-[16px]">
                <div className="absolute bg-white inset-0 rounded-[16px]" />
                <img alt="User Avatar" className="absolute max-w-none object-cover rounded-[16px] w-full h-full" src="/assets/figma/new-screen/frame-avatar.png" />
              </div>
            </div>
            <p className="flex-1 font-['Inter',_'Noto_Sans_KR',_sans-serif] font-normal leading-[24px] text-[16px] text-black">
              인공지능(AI)은 현대 기술의 가장 혁신적인 동력 중 하나로, 사회의 거의 모든 측면에 지대한 영향을 미치고 있습니다. 머신러닝(Machine Learning), 특히 딥러닝(Deep Learning) 기술의 발전은 이미지 인식, 자연어 처리(NLP), 그리고 복잡한 데이터 분석과 같은 분야에서 전례 없는 성능 향상을 이끌어냈습니다. 이는 의료 진단에서부터 자율주행 차량, 그리고 금융 시장 예측에 이르기까지 다양한 산업 분야에 혁신적인 변화를 가져오고 있습니다. AI의 발전은 단순한 기술적 진보를 넘어, 인간의 삶의 질을 향상시키고 새로운 가치를 창출하는 데 중요한 역할을 합니다.
            </p>
          </div>

          {/* AI Response */}
          <div className="absolute bg-white flex flex-col gap-[16px] items-start left-[20px] overflow-hidden px-[16px] py-[24px] rounded-[24px] top-[390px] w-[984px]">
            <div className="flex gap-[16px] items-start w-full">
              <div className="relative shrink-0 w-[32px] h-[32px]">
                <img alt="Upload" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/upload-icon.svg" />
              </div>
              <p className="flex-1 font-['Inter',_sans-serif] font-normal leading-[24px] text-[16px] text-black">
                Artificial Intelligence (AI) stands as one of the most transformative forces in modern technology, profoundly impacting nearly every facet of society. The evolution of Machine Learning, particularly Deep Learning techniques, has ushered in unprecedented performance improvements in fields such as image recognition, Natural Language Processing (NLP), and complex data analysis. This has driven revolutionary changes across diverse industries, from medical diagnostics and autonomous vehicles to financial market prediction. The advancement of AI goes beyond mere technological progress; it plays a crucial role in enhancing the quality of human life and generating new value.
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="absolute bottom-[20px] flex flex-col gap-[8px] items-center left-[20px] w-[984px]">
            <div className="bg-white flex items-center justify-between overflow-hidden px-[20px] py-[8px] rounded-full w-full shadow-[0px_0px_4px_0px_inset_rgba(0,0,0,0.2)]">
              <div className="relative shrink-0 w-[32px] h-[32px]">
                <img alt="Upload" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/upload-icon.svg" />
              </div>
              <div className="relative shrink-0 w-[24px] h-[24px]">
                <img alt="Send" className="block max-w-none w-full h-full" src="/assets/figma/new-screen/send-icon.svg" />
              </div>
            </div>
            <p className="font-['Inter',_'Noto_Sans_KR',_sans-serif] font-normal text-[#858585] text-[10px] text-center whitespace-nowrap tracking-[-0.4px]">
              Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
