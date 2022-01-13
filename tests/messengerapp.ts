import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ACCOUNT_DISCRIMINATOR_SIZE } from '@project-serum/anchor/dist/cjs/coder';
import { Messengerapp } from '../target/types/messengerapp';

const assert = require('assert');
const {SystemProgram} = anchor.web3;

describe('messengerapp', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Messengerapp as Program<Messengerapp>;

  //it('Is initialized!', async () => {
  //  // Add your test here.
  //  const tx = await program.rpc.initialize({});
  //  console.log("Your transaction signature", tx);
  //});


  describe("testing our messaging app:", function() {
    let _baseAccount;
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Messengerapp; 

    it("an account is initialized", async function(){
      const baseAccount = anchor.web3.Keypair.generate();
      await program.rpc.initialize("my first message", {
        accounts: {
          baseAccount: baseAccount.publicKey,
          // baseAccount: 'G6YXnSfmshED3X898NBNX4EAYJLqNjQfWdhoCq8WYSSX',
          // user: 'G6YXnSfmshED3X898NBNX4EAYJLqNjQfWdhoCq8WYSSX',
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      console.log("baseAccount", baseAccount.publicKey);
      console.log("user account: ", provider.wallet.publicKey);
      console.log("system account", SystemProgram.programId);

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('Data: ', account.data);
      assert.ok(account.data === "my first message");
      _baseAccount = baseAccount;
    });

    it("update the account previously created:", async function() {
      const baseAccount = _baseAccount;

      await program.rpc.update("My second message", {
        accounts: {
          baseAccount: baseAccount.publicKey,
        },
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log("Updated data: ", account.data);
      assert.ok(account.data === "My second message");
      console.log("All account data: ", account);
      console.log("All data: ", account.dataList);
      assert.ok(account.dataList.length === 2);
    });
    

  })

});
