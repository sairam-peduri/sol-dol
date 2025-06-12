import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../idl/micro_savings.json";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function createSafeProgram(idl, programId, provider) {
  const safeIdl = { ...idl, accounts: idl.accounts ?? [] };
  return new anchor.Program(safeIdl, programId, provider);
}

const PROGRAM_ID = new PublicKey(idl.address);

const Goals = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState(null);
  const [goals, setGoals] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!wallet.publicKey) return;

    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    const programInstance = createSafeProgram(idl, PROGRAM_ID, provider);
    setProgram(programInstance);
  }, [wallet, connection]);

  const fetchGoals = async () => {
    try {
      const all = await program.account.goal.all();
      setGoals(all);
    } catch (e) {
      console.error("Failed to fetch goals", e);
    }
  };

  useEffect(() => {
    if (program) fetchGoals();
  }, [program]);

  const create = async () => {
    if (!amount || isNaN(amount)) return alert("Enter valid amount");

    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
    const kp = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .createGoal(new anchor.BN(lamports), desc)
        .accounts({
          goal: kp.publicKey,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([kp])
        .rpc();

      alert("🎯 Goal created successfully!");
      setDesc("");
      setAmount("");
      fetchGoals();
    } catch (e) {
      console.error(e);
      alert("Create goal failed: " + e.message);
    }
  };

  const fund = async (goalPubkey) => {
    const amtStr = window.prompt("Enter amount (SOL) to deposit");
    if (!amtStr || isNaN(amtStr)) return;

    const lamports = Math.floor(parseFloat(amtStr) * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .depositToGoal(new anchor.BN(lamports))
        .accounts({
          goal: goalPubkey,
          user: wallet.publicKey,
        })
        .rpc();

      alert("💸 Deposited to goal!");
      fetchGoals();
    } catch (e) {
      console.error(e);
      alert("Deposit failed: " + e.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">🎯 Your Goals</h2>

      <div className="space-y-2 mb-6">
        <input
          placeholder="Goal Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
        />
        <input
          type="number"
          placeholder="Target amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
        />
        <button
          onClick={create}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Goal
        </button>
      </div>

      <ul className="space-y-4">
        {goals.map(({ publicKey, account }) => {
          const savedSol = account.saved.toNumber() / LAMPORTS_PER_SOL;
          const targetSol = account.amount.toNumber() / LAMPORTS_PER_SOL;
          const pct = ((savedSol / targetSol) * 100).toFixed(2);

          return (
            <li
              key={publicKey.toString()}
              className="p-4 bg-gray-50 border rounded-md shadow-sm"
            >
              <p className="text-lg font-semibold">{account.description}</p>
              <p className="text-sm text-gray-700 mb-2">
                Saved: {savedSol} / {targetSol} SOL ({pct}%)
              </p>
              <button
                onClick={() => fund(publicKey)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Deposit to Goal
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Goals;
