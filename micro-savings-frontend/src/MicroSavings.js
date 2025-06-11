// src/MicroSavings.js
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "./idl/micro_savings.json";
import { SystemProgram } from "@solana/web3.js";

const PROGRAM_ID = new anchor.web3.PublicKey(
  "AXP5XUGdGcAYpmxzmJr54vrvdvgbsohGDNA3hUJ3oC3B"
);

const connection = new anchor.web3.Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

export default function MicroSavings() {
  const wallet = useWallet();
  const [program, setProgram] = useState(null);
  const [savingsKey, setSavingsKey] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!wallet.publicKey) return;
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    const program = new anchor.Program(idl, provider); // ✅ Use new constructor
    setProgram(program);
  }, [wallet, connection]);

  const initialize = async () => {
    const savings = anchor.web3.Keypair.generate();
    setSavingsKey(savings.publicKey);
    try {
      await program.methods.initializeAccount()
        .accounts({
          savings: savings.publicKey,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([savings])
        .rpc();
      alert("Account initialized");
    } catch (err) {
      console.error("Init failed:", err);
    }
  };

  const deposit = async () => {
    if (!savingsKey) return alert("Initialize first!");
    try {
      await program.methods.deposit(new anchor.BN(100))
        .accounts({
          savings: savingsKey,
          user: wallet.publicKey,
        })
        .rpc();
      const acc = await program.account.savings.fetch(savingsKey);
      setBalance(acc.balance.toString());
    } catch (err) {
      console.error("Deposit failed:", err);
    }
  };

  return (
    <div>
      <button onClick={initialize}>Initialize Account</button>
      <button onClick={deposit}>Deposit 100</button>
      {balance !== null && <p>Balance: {balance}</p>}
    </div>
  );
}
