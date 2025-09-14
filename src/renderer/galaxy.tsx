import React from "react";
//import "./GalaxyOnChat.css";
import "./galaxy.css";
import { Menu, Settings } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GalaxyOnChatSummary from "./galaxy_summary";
import GalaxyOnChatTranslate from "./galaxy_translate";
import imgMynauiSend from '../assets/send.svg';

const RouteContainer = () => {
  return (
      <Routes>
      <Route index element={
        <div className="button-group">
          <Link to="/summary" className="chip">문서 요약 및 질의하기</Link>
          <Link to="/translate" className="chip">번역하기</Link>
          <Link to="/helper" className="chip">내 PC 도우미</Link>
        </div>
      } />
      <Route path="/summary" element={<GalaxyOnChatSummary />} />
      <Route path="/translate" element={<GalaxyOnChatTranslate />} />
      <Route path="/helper" element={<GalaxyOnChatSummary />} />
      <Route path="*" element={<div style={{color:"red"}}>⚠ 라우트 매칭 실패</div>} />
      </Routes>
  );
};

export default function GalaxyOnChat() {
  return (
    <div className="galaxy-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <Menu className="icon" />
          <span className="title">Galaxy on Chat</span>
        </div>
        <Settings className="icon" />
      </div>

      {/* Body */}
      <div className="body">
        <div className="card">
          <div className="card-content">
            <div>
              <p className="greeting">안녕하세요, JD님.</p>
              <p className="greeting">무엇을 도와드릴까요?</p>
            </div>

            <RouteContainer />
            {/* Buttons
              <button className="chip">문서 요약 및 질의하기</button>
              <button className="chip">번역하기</button>
              <button className="chip">내 PC 도우미</button>
              <button className="chip">보이스노트 도우미</button>
              <button className="chip">갤럭시 온 챗 도우미</button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="input-container">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="chat-input"
          />
        </div>
        <button className="send-button">
            <img alt="" className="w-6 h-6" src={imgMynauiSend} />
          {/*➤*/}
          </button>
      </div>
    </div>
  );
}
