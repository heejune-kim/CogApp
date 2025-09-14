import React, { useState } from 'react';
import './Service1.css';

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
  alert(`RAG_PATH set to: ${data.RAG_PATH}`);
};

const GalaxyOnChat: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleOpenFile = async () => {
    /*
    if (ipcRenderer) {
      const result = await ipcRenderer.invoke('show-open-dialog', {
        properties: ['openFile']
      });
      if (result && result.filePaths && result.filePaths.length > 0) {
        setFilePath(result.filePaths[0]);
      }
    } else {
      alert('File dialog is only available in Electron.');
    }
    */


    // 타입 선언이 있다면 window.electronAPI 사용 가능
    const res = await window.electronAPI.openFileDialog({
      properties: ['openFile'],                // 필요 시 ['openDirectory', 'multiSelections']
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
    });
    if (!res.canceled && res.filePaths?.length) {
      // 사용자가 파일을 선택한 경우
      console.log('선택된 파일:', res.filePaths[0]);
      /*
      // Call REST API to set RAG_PATH. PUT request to /set-rag-path/
      await fetch('http://localhost:8000/set-rag-path/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rag_path: res.filePaths[0] }),
      });
      // Get RAG_PATH to confirm
      const response = await fetch('http://localhost:8000/get-rag-path/');
      const data = await response.json();
      console.log('Current RAG_PATH:', data.RAG_PATH);
      alert(`RAG_PATH set to: ${data.RAG_PATH}`);
      */
      sendFilePathToServer(res.filePaths[0]);

      const _fileName = res.filePaths[0].split('\\').pop().split('/').pop();
      //setFilePath(res.filePaths[0]);
      setFileName(_fileName || null);
    } else {
      // 사용자가 취소한 경우
    }
  };

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
                      fileName && ( <div>
                          {
                            // 파일명만 표시 (in windows or unix)
                            fileName
                          }
                      </div>
                      )
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
            <div className="relative size-6" data-name="quill:hamburger" data-node-id="1:378">
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
      <div className="absolute bg-white h-12 left-0 overflow-clip top-0 w-[1024px]" data-node-id="1:384">
        <div className="absolute content-stretch flex gap-[5px] items-center justify-start left-5 top-3.5" data-node-id="1:385">
          <div className="relative shrink-0 size-6" data-name="line" data-node-id="1:386">
            <img alt="" className="block max-w-none size-full" src={imgLine} />
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-nowrap" data-node-id="1:391">
            <p className="leading-[normal] whitespace-pre">Galaxy on Chat</p>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[42px] items-start justify-start left-[340px] top-[132px] w-[640px]" data-node-id="1:392">
        <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-nowrap whitespace-pre" data-node-id="1:393">
          <p className="mb-0">안녕하세요, JD님.</p>
          <p className="">어떤 내용이 궁금하신가요?</p>
        </div>
      </div>
      <div className="absolute bg-white content-stretch flex items-center justify-start left-[876px] top-2" data-node-id="1:394">
        <div className="h-8 relative shrink-0 w-[46px]" data-name="Title Bar / Parts / Title Bar Caption Control Button" data-node-id="1:395">
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionControlButton} />
        </div>
        <div className="h-8 relative shrink-0 w-[46px]" data-name="Title Bar / Parts / Title Bar Caption Control Button" data-node-id="1:398">
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionControlButton1} />
        </div>
        <div className="h-8 relative shrink-0 w-[46px]" data-name="Title Bar / Parts / Title Bar Caption Control Button" data-node-id="1:401">
          <img alt="" className="block max-w-none size-full" src={imgTitleBarPartsTitleBarCaptionControlButton2} />
        </div>
      </div>
      <div className="absolute bottom-5 content-stretch flex flex-col gap-2 items-center justify-start left-[340px] w-[664px]" data-node-id="1:404">
        <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-5 py-2 relative rounded-[9999px] shrink-0 w-full" data-node-id="1:405">
          <div className="relative shrink-0 size-8" data-name="prime:upload" data-node-id="1:406">
            <img alt="" className="block max-w-none size-full" src={imgPrimeUpload} />
          </div>
          <div className="relative shrink-0 size-6" data-name="mynaui:send" data-node-id="1:411">
            <img alt="" className="block max-w-none size-full" src={imgMynauiSend} />
          </div>
          <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_4px_0px_inset_rgba(0,0,0,0.2)]" />
        </div>
        <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#858585] text-[10px] text-center text-nowrap tracking-[-0.4px]" data-node-id="1:413">
          <p className="leading-[normal] whitespace-pre">{`Galaxy on Chat은 실수 할 수 있습니다. 중요 정보는 원문 문서를 재확인 해주세요. `}</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-4 items-start justify-start left-[340px] top-[250px]" data-node-id="1:414">
        <div className="bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] bg-white overflow-clip relative rounded-[16px] shrink-0 size-8" data-node-id="1:415" style={{ backgroundImage: `url('${imgFrame1000014255}')` }}>
          <div className="absolute left-[5px] size-[22px] top-[5px]" data-name="fluent:person-16-filled" data-node-id="1:416" />
        </div>
        <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black w-[616px]" data-node-id="1:417">
          <p className="leading-[22px]">이번 상반기에 제안된 무기체계들은 현재의 위협 환경과 미래 전장 양상에 얼마나 효과적으로 대응 할 수 있는지 기대치를 알려줘</p>
        </div>
      </div>
      <div className="absolute bg-white box-border content-stretch flex flex-col gap-4 items-start justify-start left-[340px] overflow-clip px-4 py-6 rounded-[24px] top-[314px] w-[664px]" data-node-id="1:418">
        <div className="content-stretch flex gap-4 items-start justify-start relative shrink-0 w-[632px]" data-node-id="1:419">
          <div className="relative shrink-0 size-8" data-name="prime:upload" data-node-id="1:420">
            <img alt="" className="block max-w-none size-full" src={imgPrimeUpload} />
          </div>
          <div className="basis-0 font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-black" data-node-id="1:425">
            <p className="mb-0">
              현재 제시된 상반기 무기체계들은 급변하는 미래 전장 양상에 대한 우리 군의 전략적 대응 의지를 명확히 보여주고 있습니다. 특히, 다음과 같은 핵심 변화에 효과적으로 대응할 것으로 기대됩니다.
              <br aria-hidden="true" className="" />
              <br aria-hidden="true" className="" />
            </p>
            <p className="mb-0">
              1. 초연결 네트워크 중심전(NCW) 환경 구축 가속화: 이번 무기체계들은 단순한 단일 무기 플랫폼을 넘어, 정보 공유 및 통합 능력을 극대화하는 방향으로 설계되었습니다. 이는 각 전력체계가 유기적으로 연동되어 실시간으로 전장 정보를 공유하고, 지휘통제체계와 연동되어 신속하고 정확한 의사결정을 지원함으로써 미래 네트워크 중심전 환경에서의 결정적 우위 확보에 크게 기여할 것입니다.
              <br aria-hidden="true" className="" />
              <br aria-hidden="true" className="" />
            </p>
            <p className="">2. 유·무인 복합체계(MUM-T) 전투 역량 강화: 특히 주목할 점은 유인-무인 복합체계 운용을 위한 기반 마련입니다. 정찰, 감시, 타격 등 다양한 임무에 투입될 무인 체계의 도입 및 기존 유인 전력과의 연동성 강화는 인명 피해를 최소화하면서도 작전 효율성을 극대화할 수 있는 미래 전장의 핵심 역량입니다. 이번 무기체계들은 이러한 유·무인 복합작전 수행 능력을 한 단계 끌어올릴 것으로 기대됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyOnChat;