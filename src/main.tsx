import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { CmsProvider } from './context/CmsContext';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <CmsProvider>
      <App />
    </CmsProvider>
  </LanguageProvider>
);
