import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Profile() {
  const { publicKey, connected } = useWallet();

  const copyToClipboard = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      alert('📋 Wallet address copied to clipboard!');
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert('❌ Failed to copy wallet address.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">👨‍🌾 Farmer Profile</h1>

      {connected && publicKey ? (
        <div className="text-gray-800 space-y-4">
          <div>
            <label className="font-semibold block">Wallet Address:</label>
            <div className="text-sm break-words bg-gray-100 px-3 py-2 rounded border">
              {publicKey.toBase58()}
            </div>
            <button
              onClick={copyToClipboard}
              className="mt-2 inline-block text-indigo-600 hover:underline text-sm"
            >
              📋 Copy to clipboard
            </button>
          </div>

          <div>
            <label className="font-semibold block">Farmer ID:</label>
            <span className="text-green-700 text-sm">
              FARM-{publicKey.toBase58().slice(0, 6)}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-red-600 text-sm">🚫 Please connect your wallet to view your profile.</p>
      )}
    </div>
  );
}
