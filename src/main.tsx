import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Guard against external browser extension injection errors (e.g. MetaMask, WalletConnect, disconnected background ports)
if (typeof window !== 'undefined') {
  const isIgnoredError = (msg: string) => {
    return (
      msg.includes('MetaMask') || 
      msg.includes('metamask') || 
      msg.includes('ethereum') ||
      msg.includes('Failed to connect to MetaMask') ||
      msg.includes('chrome-extension://') ||
      msg.includes('moz-extension://') ||
      msg.includes('Could not establish connection. Receiving end does not exist') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes('The message port closed before a response was received')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (isIgnoredError(reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || '';
    const filename = event.filename || '';
    if (isIgnoredError(message) || isIgnoredError(filename)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

