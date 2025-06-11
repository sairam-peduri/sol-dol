import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import idl from '../idl/micro_savings.json';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey(idl.address);

export default function Withdraw() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!publicKey || !wallet) return;

    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const programInstance = new anchor.Program(idl, PROGRAM_ID, provider);
    setProgram(programInstance);
  }, [publicKey, wallet, connection]);

  const withdraw = async () => {
    if (!program) return alert('Please connect your wallet.');

    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .withdraw(new anchor.BN(lamports))
        .accounts({
          savings: publicKey,
          user: publicKey,
        })
        .rpc();

      alert('Withdrawal successful!');
      setAmount('');
    } catch (e) {
      alert('Withdrawal failed: ' + e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Withdraw Funds</h1>
      <input
        type="number"
        step="0.01"
        placeholder="Enter amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={withdraw}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
      >
        Withdraw
      </button>
    </div>
  );
}
