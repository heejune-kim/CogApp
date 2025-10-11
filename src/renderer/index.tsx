import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import GalaxyOnChat from './galaxy';
//import GalaxyOnChat from '../components/MainScreen';
//import Service1 from '../components/Service1';
import Service2 from '../components/Service2';
//import { BrowserRouter as Router } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
//import './styles.css'; // 필요 시

function App() {
  return (
    <Router>
      {
        <GalaxyOnChat />
        //<Service1 />
        //<Service2 />
        //<Service3 />
      }
      </Router>
  );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
