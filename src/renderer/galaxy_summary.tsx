
import React from "react";

export default function GalaxyOnChatSummary() {
  return (
    <div className="flex h-full">
      {/* 왼쪽 파일 업로드 영역 */}
      <div className="w-1/4 bg-gray-50 border-r flex flex-col items-center justify-start p-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg w-full h-40 text-center text-gray-500">
          <span>파일 끌어다 놓기</span>
          <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded">
            파일 선택하기
          </button>
        </div>

        {/* 업로드된 파일 리스트 */}
        <div className="mt-6 w-full">
          <div className="flex items-center space-x-2 bg-white border rounded p-2 text-sm shadow-sm">
            📄 <span>2025_상반기_무기체계.hwp</span>
          </div>
        </div>

        {/* 파일 제한 안내 */}
        <div className="mt-auto text-xs text-gray-400 text-center">
          <p>- 지원문서포맷: PDF, DOCX, PPTX, HWP, HWPX</p>
          <p>- 용량제한: 500MB (1분석 기준)</p>
          <p>- 처리시간: 10분내외 (1문서 기준)</p>
        </div>
      </div>

      {/* 오른쪽 질의응답 영역 */}
      <div className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
        {/* 인사 메시지 */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-800">안녕하세요, JD님.</p>
          <p className="text-xl text-gray-800">어떤 내용이 궁금하신가요?</p>
        </div>

        {/* 사용자 질문 */}
        <div className="flex items-start space-x-3 mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div className="bg-gray-100 p-3 rounded-lg max-w-xl text-gray-800">
            이번 상반기에 제안된 무기체계들은 현재의 위협 환경과 미래 전장 향상에
            얼마나 효과적으로 대응할 수 있는지 기대치를 알려줘
          </div>
        </div>

        {/* AI 답변 */}
        <div className="flex items-start space-x-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
            alt="AI"
            className="w-8 h-8"
          />
          <div className="bg-gray-50 border p-4 rounded-lg max-w-2xl text-gray-700 text-sm leading-relaxed">
            <p>
              현재 제시된 상반기 무기체계들은 급변하는 미래 전장 양상에 대한
              우리 군의 전략적 대응 의지를 명확히 보여주고 있습니다...
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>
                초연결 네트워크 중심(NCW)형 환경 구축 가속화: 이번 무기체계들은...
              </li>
              <li>
                유·무인 복합체계(MUM-T) 전투 역량 강화: 특히 주목할 부분은...
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
