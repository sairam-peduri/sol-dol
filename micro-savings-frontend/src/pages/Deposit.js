import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import idlRaw from '../idl/micro_savings.json';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// Merge `types[]` into `accounts[]`
function mergeTypesIntoAccounts(idl) {
  const accounts = idl.accounts || [];
  const types = idl.types || [];

  return {
    ...idl,
    accounts: accounts.map((acc) => {
      const matchedType = types.find((t) => t.name === acc.name);
      return {
        ...acc,
        type: matchedType?.type || {},
      };
    }),
  };
}

const idl = mergeTypesIntoAccounts(idlRaw);
const PROGRAM_ID = new PublicKey(idl.metadata?.address || idl.address);

export default function Deposit() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey || !wallet) return;

    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: 'processed',
    });
    const programInstance = new anchor.Program(idl, PROGRAM_ID, provider);
    setProgram(programInstance);
  }, [publicKey, wallet, connection]);

  const deposit = async () => {
    if (!program || !publicKey) return alert('🔌 Connect your wallet first.');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0)
      return alert('❗ Enter a valid amount.');

    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

    const [savingsPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('savings'), publicKey.toBuffer()],
      PROGRAM_ID
    );

    try {
      setLoading(true);

      await program.methods
        .deposit(new anchor.BN(lamports))
        .accounts({
          savings: savingsPDA,
          user: publicKey,
        })
        .rpc();

      alert(`✅ Deposited ${amount} SOL to your savings (${publicKey.toBase58().slice(0, 6)}...)`);
      setAmount('');
    } catch (e) {
      console.error('⚠️ Deposit Error:', e);
      alert('Deposit failed: ' + (e.message || e.toString()));
    } finally {
      setLoading(false);
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
          disabled={loading}
          className={`${
            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white py-2 px-4 rounded transition`}
        >
          {loading ? 'Depositing...' : 'Deposit'}
        </button>
      </div>
    </div>
  );
}
