import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WalletConnectionProvider from './WalletConnectionProvider';
import './index.css'; // TailwindCSS styles

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <WalletConnectionProvider>
      <App />
    </WalletConnectionProvider>
  </React.StrictMode>
);
