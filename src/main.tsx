import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import { ImageModalProvider } from './context/ImageModalContext';
import App from './App.tsx';
import './index.css';
import { initAnalytics } from './lib/analytics';

// Initialize GA4 & Microsoft Clarity
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ImageModalProvider>
        <App />
      </ImageModalProvider>
    </BrowserRouter>
  </StrictMode>,
);


