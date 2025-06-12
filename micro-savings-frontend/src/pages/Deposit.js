import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import idl from '../idl/micro_savings.json';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

function createSafeProgram(idl, programId, provider) {
  const safeIdl = { ...idl, accounts: idl.accounts ?? [] };
  return new anchor.Program(safeIdl, programId, provider);
}

const PROGRAM_ID = new anchor.web3.PublicKey(idl.address);

export default function Deposit() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!publicKey) return;

    const provider = new anchor.AnchorProvider(connection, window.solana, {});
    const programInstance = createSafeProgram(idl, PROGRAM_ID, provider);
    setProgram(programInstance);
  }, [publicKey, connection]);

  const deposit = async () => {
    if (!program || !publicKey) return alert('Connect wallet first');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return alert('Enter valid amount');

    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

    const [savingsPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("savings"), publicKey.toBuffer()],
      PROGRAM_ID
    );

    try {
      await program.methods
        .deposit(new anchor.BN(lamports))
        .accounts({
          savings: savingsPDA,
          user: publicKey
        })
        .rpc();

      alert('✅ Deposited successfully!');
      setAmount('');
    } catch (e) {
      console.error(e);
      alert('⚠️ Error: ' + e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-4">💰 Deposit SOL</h1>

      <div className="flex flex-col gap-4">
        <input
          type="number"
          step="0.01"
          placeholder="Enter amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <button
          onClick={deposit}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Deposit
        </button>
      </div>
    </div>
  );
}
