import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Profile() {
  const { publicKey } = useWallet();

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">Profile</h1>
      {publicKey ? (
        <div className="text-gray-800 space-y-2">
          <p>
            <span className="font-semibold">Wallet:</span>{' '}
            {publicKey.toBase58()}
          </p>
          <p>
            <span className="font-semibold">Farmer ID:</span>{' '}
            FARM-{publicKey.toBase58().slice(0, 6)}
          </p>
        </div>
      ) : (
        <p className="text-red-600">Connect wallet to view profile.</p>
      )}
    </div>
  );
}
