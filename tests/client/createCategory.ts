import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProtocolEvent } from "../../target/types/protocol_event";
import assert from "assert";
import {
  confirmTransaction,
  createCategory,
  findCategoryPda,
  signAndSendInstructions,
} from "../../client";
import { ComputeBudgetProgram, SystemProgram } from "@solana/web3.js";
import { createWalletWithBalance } from "../util/test_util";

describe("Test Client CreateCategory", () => {
  it("Create category", async () => {
    const program = anchor.workspace.ProtocolEvent as Program<ProtocolEvent>;
    const connection = program.provider.connection;
    const signer = await createWalletWithBalance();

    const code = "CATS";
    const name = "Cats";
    const pda = findCategoryPda(code, program.programId);
    const options = {
      computeUnitLimit: 100000,
      computeUnitPrice: 1000,
    };

    const accounts = {
      category: pda,
      payer: signer.publicKey,
      systemProgram: SystemProgram.programId,
    };

    const args = { name, code };

    const instruction = createCategory(args, accounts);
    const signature = await signAndSendInstructions(
      connection,
      signer,
      [instruction],
      options,
    );
    await confirmTransaction(connection, signature);

    const tnx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    const computeBudgetSuccessCount = tnx.meta.logMessages.filter(
      (message) =>
        message ===
        `Program ${ComputeBudgetProgram.programId.toBase58()} success`,
    ).length;

    // 2 successful inx - one for united one for price
    assert(computeBudgetSuccessCount === 2);

    const category = await program.account.category.fetch(pda);
    assert(category.code === code);
    assert(category.name === name);
    assert(category.payer.toBase58() === signer.publicKey.toBase58());
  });
});
