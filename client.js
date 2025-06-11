const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const SAVINGS_KEYPAIR_PATH = './savings.json';

const loadOrCreateKeypair = () => {
  if (fs.existsSync(SAVINGS_KEYPAIR_PATH)) {
    const data = fs.readFileSync(SAVINGS_KEYPAIR_PATH);
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(data)));
  }
  const newKeypair = Keypair.generate();
  fs.writeFileSync(SAVINGS_KEYPAIR_PATH, JSON.stringify([...newKeypair.secretKey]));
  return newKeypair;
};

const main = async () => {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync('/home/boppani/.config/solana/devnet.json')))
  );
  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {});
  anchor.setProvider(provider);

  const programId = new PublicKey('AXP5XUGdGcAYpmxzmJr54vrvdvgbsohGDNA3hUJ3oC3B');
  const idl = require('./target/idl/micro_savings.json');
  const program = new anchor.Program(idl, programId, provider);

  const savings = loadOrCreateKeypair();

  try {
    const accountInfo = await connection.getAccountInfo(savings.publicKey);
    if (!accountInfo) {
      await program.methods.initializeAccount().accounts({
        savings: savings.publicKey,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).signers([savings]).rpc();
      console.log("✅ Savings account created");
    }

    await program.methods.deposit(new anchor.BN(100)).accounts({
      savings: savings.publicKey,
      user: wallet.publicKey,
    }).rpc();
    console.log("✅ Deposited 100");

    await program.methods.withdraw(new anchor.BN(50)).accounts({
      savings: savings.publicKey,
      user: wallet.publicKey,
    }).rpc();
    console.log("✅ Withdrew 50");

    const account = await program.account.savings.fetch(savings.publicKey);
    console.log('🔎 Balance:', account.balance.toString());

  } catch (err) {
    console.error('❌ Error occurred:', err);
  }
};

main().catch(console.error);
