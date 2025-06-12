import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Profile() {
  const { publicKey } = useWallet();

  const copyToClipboard = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      alert('Wallet address copied to clipboard!');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">👨‍🌾 Farmer Profile</h1>

      {publicKey ? (
        <div className="text-gray-800 space-y-3">
          <div>
            <span className="font-semibold">Wallet:</span>
            <div className="text-sm break-all mt-1">{publicKey.toBase58()}</div>
            <button
              onClick={copyToClipboard}
              className="mt-1 text-indigo-600 hover:underline text-sm"
            >
              Copy to clipboard
            </button>
          </div>

          <p>
            <span className="font-semibold">Farmer ID:</span>{' '}
            FARM-{publicKey.toBase58().slice(0, 6)}
          </p>
        </div>
      ) : (
        <p className="text-red-600">🚫 Connect wallet to view profile.</p>
      )}
    </div>
  );
}
