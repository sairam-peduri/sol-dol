import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import idl from '../idl/micro_savings.json';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

function createSafeProgram(idl, programId, provider) {
  const safeIdl = { ...idl, accounts: idl.accounts ?? [] };
  return new anchor.Program(safeIdl, programId, provider);
}

const PROGRAM_ID = new PublicKey(idl.address);

export default function Withdraw() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!publicKey || !window.solana) return;

    const provider = new anchor.AnchorProvider(connection, window.solana, {
      preflightCommitment: 'processed',
    });

    const programInstance = createSafeProgram(idl, PROGRAM_ID, provider)
    setProgram(programInstance);
  }, [publicKey, connection]);

  const withdraw = async () => {
    if (!program || !publicKey) {
      alert('Please connect your wallet.');
      return;
    }

    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

    if (isNaN(lamports) || lamports <= 0) {
      alert('Enter a valid amount.');
      return;
    }

    try {
      await program.methods
        .withdraw(new anchor.BN(lamports))
        .accounts({
          savings: publicKey,
          user: publicKey,
        })
        .rpc();

      alert('✅ Withdrawal successful!');
      setAmount('');
    } catch (e) {
      console.error('Withdrawal failed:', e);
      alert('❌ Withdrawal failed: ' + (e.message || e.toString()));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-red-700">Withdraw Funds</h1>
      <input
        type="number"
        step="0.01"
        placeholder="Enter amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-300"
      />
      <button
        onClick={withdraw}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        Withdraw
      </button>
    </div>
  );
}
