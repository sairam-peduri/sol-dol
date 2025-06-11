const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');

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

  const savings = anchor.web3.Keypair.generate();
  try {
    await program.methods
      .initializeAccount()
      .accounts({
        savings: savings.publicKey,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([savings])
      .rpc();
    await program.methods
      .deposit(new anchor.BN(100))
      .accounts({
        savings: savings.publicKey,
        user: wallet.publicKey,
      })
      .rpc();
    const account = await program.account.savings.fetch(savings.publicKey);
    console.log('Savings account:', savings.publicKey.toString(), 'Balance:', account.balance.toString());
  } catch (err) {
    console.error('Error:', err);
  }
};

main().catch(console.error);