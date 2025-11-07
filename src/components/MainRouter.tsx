import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainScreen from './MainScreen';
import DocSummary from './DocSummary';
import DocChat from './DocChat';
import Translate from './Translate';
import MyPcChat from './MyPcChat';

/**
 * MainRouter Component
 *
 * Configures routing for the entire application.
 * Uses HashRouter for Electron compatibility.
 *
 * Routes:
 * - / : MainScreen (메인페이지)
 * - /doc-summary : DocSummary (문서 요약하기)
 * - /doc-chat : DocChat (문서 질의하기)
 * - /translate : Translate (번역하기)
 * - /my-pc-chat : MyPcChat (내 PC 질의하기)
 */
export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/doc-summary" element={<DocSummary />} />
        <Route path="/doc-chat" element={<DocChat />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/my-pc-chat" element={<MyPcChat />} />
      </Routes>
    </Router>
  );
}
