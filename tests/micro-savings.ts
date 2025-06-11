const anchor = require('@coral-xyz/anchor');

describe('micro-savings', () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.MicroSavings;
  const provider = anchor.getProvider();

  it('Initializes and deposits', async () => {
    const savings = anchor.web3.Keypair.generate();
    await program.methods
      .initializeAccount()
      .accounts({
        savings: savings.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([savings])
      .rpc();
    await program.methods
      .deposit(new anchor.BN(100))
      .accounts({
        savings: savings.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();
    const account = await program.account.savings.fetch(savings.publicKey);
    console.log('Balance:', account.balance.toString()); // Should log 100
  });
});