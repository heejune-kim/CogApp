
import React from "react";
//import { Menu, UploadCloud, Paperclip, PaperclipIcon, X, PaperPlane, FileText, ChevronDown, Info, Image, Settings } from "lucide-react";
import { Menu, UploadCloud, Paperclip, PaperclipIcon, X, /*PaperPlane,*/ FileText, ChevronDown, Info, Image, Settings } from "lucide-react";

// Single-file React + TypeScript + Tailwind component replicating the provided UI
// Drop this into a Vite/CRA project with Tailwind configured. It does not rely on any external UI libs.

export default function GalaxyOnChatMock() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <button className="p-2 rounded-xl hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-5 h-5 rounded-full bg-blue-600" />
            <span>Galaxy on Chat</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border hover:bg-gray-50"><Settings className="w-4 h-4"/>설정</button>
            <button className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Pane */}
        <aside className="space-y-4">
          {/* Upload Card */}
          <div className="rounded-2xl bg-white border p-4">
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-8 h-8" />
              <p className="mt-3 font-medium">파일 끌어다 놓기</p>
              <p className="text-sm text-gray-500">or</p>
              <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
                파일 선택하기
              </button>
            </div>

            {/* File pill */}
            <div className="mt-4">
              <div className="flex items-center gap-3 rounded-xl border p-3 hover:bg-gray-50 cursor-default">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">2025_상반기_무기체계.hwp</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4"/></button>
              </div>
            </div>

            {/* Limits */}
            <div className="mt-6 space-y-1 text-xs text-gray-500">
              <p>• 제공문서포맷: PDF, DOCX, PPTX, HWP, HWPX</p>
              <p>• 용량제한: 500MB (1문서 기준)</p>
              <p>• 페이지제한: 100페이지 (1문서 기준)</p>
            </div>
          </div>
        </aside>

        {/* Chat Pane */}
        <section className="flex flex-col min-h-[70vh]">
          {/* Greeting */}
          <div className="rounded-2xl bg-white border p-6">
            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">안녕하세요, JD님.<br/>어떤 내용이 궁금하신가요?</h1>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              이번 상반기에 제안된 무기체계들은 현재의 위협 환경과 미래 전장 양상에 얼마나 효과적으로 대응할 수 있는지 기대치를 알려줘
            </p>
          </div>

          {/* Conversation */}
          <div className="mt-4 space-y-4">
            {/* User message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300" />
              <div className="flex-1 rounded-2xl bg-white border p-4">
                <p className="text-sm text-gray-800">이번 상반기에 제안된 무기체계들은 현재의 위협 환경과 미래 전장 양상에 얼마나 효과적으로 대응할 수 있는지 기대치를 알려줘</p>
              </div>
            </div>

            {/* Assistant response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600" />
              <div className="flex-1 rounded-2xl bg-white border p-4">
                <p className="text-sm text-gray-800">현재 제시된 상반기 무기체계들은 급변하는 미래 전장 양상에 대한 우리 군의 전략적 대응 의지를 명확히 보여주고 있습니다. 특히, 다음과 같은 핵심 변화에 효과적으로 대응할 것으로 기대됩니다.</p>
                <ol className="mt-3 space-y-2 text-sm text-gray-800 list-decimal pl-5">
                  <li>
                    초연결 네트워크 중심전(NCW) 환경 구축 가속화: 이번 무기체계들은 단순한 단일 무기 플랫폼을 넘어, 정보 공유 및 통합 능력을 극대화하는 방향으로 설계되었습니다. 이는 각 전력체계가 유기적으로 연동되어 실시간으로 전장 정보를 공유하고, 지휘통제체계와의 연동이 신속하고 정확한 의사결정을 지원함으로써 미래 네트워크 중심전 환경에서의 결정적 우위 확보에 크게 기여할 것입니다.
                  </li>
                  <li>
                    유·무인 복합체계(MUM-T) 전투 운용 강화: 특히 주목할 점은 유·무인 복합체계 운용을 위한 기반 마련입니다. 정찰, 감시, 타격 등 다양한 임무에 투입될 무인 체계들이 도입 및 기존 유인 전력과의 동시 강화는 인명 피해를 최소화하면서 작전 효율성을 극대화할 수 있는 미래 전장의 핵심 역량입니다. 이번 무기체계들은 이러한 유·무인 복합작전 수행 능력을 한 단계 끌어올릴 것으로 기대됩니다.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="mt-4 sticky bottom-4 z-10">
            <div className="flex items-center gap-2 rounded-2xl border bg-white p-2 shadow-sm">
              <input
                placeholder="메시지를 입력하세요"
                className="flex-1 px-3 py-2 outline-none text-sm"
              />
              <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
                보내기
                {/*<PaperPlane className="w-4 h-4" />*/}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer note */}
      <footer className="py-6">
        <p className="text-center text-xs text-gray-500">Galaxy on Chat은 실험 기능입니다. 중요한 정보는 문서를 재확인해주세요.</p>
      </footer>
    </div>
  );
}
