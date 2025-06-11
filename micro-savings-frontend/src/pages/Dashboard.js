import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Dashboard() {
  const { publicKey } = useWallet();

  return (
    <div className="ml-64 p-10">
      <div className="bg-white p-8 rounded shadow-lg max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">👨‍🌾 Farmer Dashboard</h1>
        {publicKey ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              <strong>Wallet Address:</strong><br />
              <span className="break-words text-sm text-gray-600">
                {publicKey.toBase58()}
              </span>
            </p>
            <div className="bg-green-100 border-l-4 border-green-500 p-4 text-green-800">
              ✅ You are connected! Start saving, withdrawing, or setting goals.
            </div>
          </div>
        ) : (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 text-red-800">
            ❌ Wallet not connected. Please connect your wallet to access your dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
