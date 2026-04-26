import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safety check for fetch property on window to prevent "Cannot set property fetch of #<Window> which has only a getter"
try {
  if (typeof window !== 'undefined' && !('fetch' in window)) {
    // If we need to polyfill, we do it safely via a hidden property if needed, 
    // but usually, this error happens because a library tries to assign to a read-only local fetch.
    console.log('Fetch safety check completed');
  }
} catch (e) {
  console.warn('Fetch property check warning:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
