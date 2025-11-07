import './index.css';
import { createRoot } from 'react-dom/client';
import MainRouter from '../components/MainRouter';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<MainRouter />);
