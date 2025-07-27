import React from 'react';
import { createRoot } from 'react-dom/client';
//import './styles.css'; // 필요 시

function App() {
  return <h1>안녕, Electron + React + TypeScript!</h1>;
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
