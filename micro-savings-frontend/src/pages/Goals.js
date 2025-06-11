import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../idl/micro_savings.json";
import { SystemProgram } from "@solana/web3.js";
import process from "process/browser.js";

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
    setProgram(new anchor.Program(idl, provider));
  }, [wallet, connection]);

  const fetchGoals = async () => {
    const all = await program.account.goal.all();
    setGoals(all);
  };

  useEffect(() => {
    if (program) fetchGoals();
  }, [program]);

  const create = async () => {
    const kp = anchor.web3.Keypair.generate();
    try {
      await program.methods
        .createGoal(new anchor.BN(amount), desc)
        .accounts({
          goal: kp.publicKey,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([kp])
        .rpc();
      alert("Goal created");
      fetchGoals();
    } catch (e) {
      console.error(e);
      alert("Create failed");
    }
  };

  const fund = async (goalPubkey) => {
    const amt = window.prompt("Amount to deposit");
    if (!amt) return;
    try {
      await program.methods
        .depositToGoal(new anchor.BN(amt))
        .accounts({ goal: goalPubkey, user: wallet.publicKey })
        .rpc();
      alert("Deposited");
      fetchGoals();
    } catch (e) {
      console.error(e);
      alert("Deposit failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Goals</h2>

      <div className="space-y-2 mb-6">
        <input
          placeholder="Description"
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
        {goals.map(({ account }) => {
          const pct = (account.saved * 100) / account.amount;
          return (
            <li
              key={account.goal.toString()}
              className="p-4 bg-gray-50 border rounded-md shadow-sm"
            >
              <p className="text-lg font-semibold">{account.description}</p>
              <p className="text-sm text-gray-700 mb-2">
                {account.saved}/{account.amount} ({pct.toFixed(2)}%)
              </p>
              <button
                onClick={() => fund(account.goal)}
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
