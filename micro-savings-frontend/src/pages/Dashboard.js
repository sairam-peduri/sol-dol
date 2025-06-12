import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorProvider, web3 } from '@coral-xyz/anchor';
import idlRaw from '../idl/micro_savings.json';
import { PublicKey } from '@solana/web3.js';

// ✅ Merge types into accounts to avoid .size error
const mergeTypesIntoAccounts = (idl) => {
  const accounts = idl.accounts || [];
  const types = idl.types || [];

  const mergedAccounts = accounts.map((account) => {
    if (account.type?.kind === 'struct' && Array.isArray(account.type?.fields)) {
      return account;
    }

    const match = types.find((t) => t.name === account.name);
    if (!match) {
      console.warn(`⚠️ No matching type found for account "${account.name}"`);
    }

    return {
      ...account,
      type: match?.type || {
        kind: 'struct',
        fields: [],
      },
    };
  });

  return {
    ...idl,
    accounts: mergedAccounts,
  };
};

const idl = mergeTypesIntoAccounts(idlRaw);
const PROGRAM_ID = new PublicKey(idl.metadata?.address || idl.address);

export default function Dashboard() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initProgram = async () => {
      console.log('✅ useEffect running. Wallet:', wallet);
      console.log('🔑 publicKey:', publicKey?.toBase58());

      if (!publicKey || !wallet?.adapter?.signTransaction || !connection) {
        console.warn('⚠️ Wallet not fully connected or missing adapter methods');
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const provider = new AnchorProvider(connection, wallet, {});
        const programInstance = new anchor.Program(idl, PROGRAM_ID, provider);
        setProgram(programInstance);

        const [savingsPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('savings'), publicKey.toBuffer()],
          PROGRAM_ID
        );

        try {
          await programInstance.account.savings.fetch(savingsPDA);
          setInitialized(true);
        } catch {
          console.log('🟡 Savings account not initialized yet.');
          setInitialized(false);
        }
      } catch (err) {
        console.error('❌ Error setting up program:', err);
        setProgram(null);
      } finally {
        setLoading(false);
      }
    };

    initProgram();
  }, [publicKey, wallet, connection]);

  const initializeAccount = async () => {
    if (!program || !publicKey) {
      return alert('❌ Wallet not connected or program not loaded.');
    }

    try {
      const [savingsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('savings'), publicKey.toBuffer()],
        PROGRAM_ID
      );

      await program.methods
        .initializeAccount()
        .accounts({
          savings: savingsPDA,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      alert('✅ Account initialized successfully!');
      setInitialized(true);
    } catch (e) {
      console.error('❌ Initialization failed:', e);
      alert('Initialization failed: ' + (e.message || e.toString()));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        👨‍🌾 Farmer Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-500">⏳ Loading...</p>
      ) : publicKey ? (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            <strong>Wallet Address:</strong>
            <br />
            <span className="break-words text-sm text-gray-600">
              {publicKey.toBase58()}
            </span>
          </p>

          {initialized ? (
            <div className="bg-green-100 p-3 rounded text-green-700 font-semibold">
              ✅ Your account is initialized. Start saving!
            </div>
          ) : (
            <button
              onClick={initializeAccount}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Initialize Savings Account
            </button>
          )}
        </div>
      ) : (
        <div className="text-red-500 font-semibold">
          🚫 Wallet not connected. Please connect your wallet to access your dashboard.
        </div>
      )}
    </div>
  );
}
