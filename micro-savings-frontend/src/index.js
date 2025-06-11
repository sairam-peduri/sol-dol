import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WalletConnectionProvider from './WalletConnectionProvider';
import './index.css'; // Tailwind styles here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WalletConnectionProvider>
    <App />
  </WalletConnectionProvider>
);
