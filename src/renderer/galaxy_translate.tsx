
import React, { useState } from "react";

export default function GalaxyOnChatTranslate() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = () => {
    // 실제 API 연결 대신 샘플 번역 결과
    setTranslatedText("This is the translated result of: " + inputText);
  };

  return (
    <div className="flex h-full">
      {/* 왼쪽 입력 영역 */}
      <div className="w-1/2 border-r bg-gray-50 p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">번역할 내용 입력</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="번역할 텍스트를 입력하세요..."
          className="flex-1 border rounded p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleTranslate}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          번역하기
        </button>
      </div>

      {/* 오른쪽 결과 영역 */}
      <div className="w-1/2 p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">번역 결과</h2>
        <div className="flex-1 border rounded p-3 bg-white shadow-sm text-gray-700 overflow-y-auto">
          {translatedText || "여기에 번역 결과가 표시됩니다."}
        </div>
      </div>
    </div>
  );
}
