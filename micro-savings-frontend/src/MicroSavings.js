import React, { useState } from 'react';

function MicroSavings() {
  const [amount, setAmount] = useState('');
  const [accountInitialized, setAccountInitialized] = useState(false);

  const handleInitialize = () => {
    // Call your Solana program's initialize function here
    setAccountInitialized(true);
  };

  const handleDeposit = () => {
    // Call Solana deposit instruction here
    console.log('Depositing:', amount);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Micro-Savings Dashboard
      </h2>

      {!accountInitialized ? (
        <button
          onClick={handleInitialize}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Initialize Account
        </button>
      ) : (
        <div className="space-y-4">
          <input
            type="number"
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleDeposit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Deposit
          </button>
        </div>
      )}
    </div>
  );
}

export default MicroSavings;
