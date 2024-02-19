import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProtocolEvent } from "../../target/types/protocol_event";
import assert from "assert";
import {
  createIndividualParticipant,
  findParticipantPda,
  signAndSendInstructionsBatch,
} from "../../client";
import { SystemProgram } from "@solana/web3.js";
import {
  createCategory,
  createSubcategory,
  createWalletWithBalance,
} from "../util/test_util";

describe("Test Client CreateParticipant", () => {
  it("Create participants batch", async () => {
    const program = anchor.workspace.ProtocolEvent as Program<ProtocolEvent>;
    const connection = program.provider.connection;
    const signer = await createWalletWithBalance();

    const categoryCode = "MOVIES";
    const categoryName = "Movies";
    const category = await createCategory(
      program,
      categoryCode,
      categoryName,
      signer,
    );

    const subcategoryCode = "UKBOX";
    const subcategoryName = "UK Box Office";
    const subcategory = await createSubcategory(
      program,
      category,
      subcategoryCode,
      subcategoryName,
      signer,
    );

    const participants = [
      {
        code: "BARBIE",
        name: "Barbie",
      },
      {
        code: "OPP",
        name: "Oppenheimer",
      },
      {
        code: "MEG2",
        name: "The Meg 2",
      },
    ];

    const instructions = participants.map((participant, i) => {
      const participantPda = findParticipantPda(
        subcategory,
        i,
        program.programId,
      );
      const args = { code: participant.code, name: participant.name };
      const accounts = {
        participant: participantPda,
        subcategory: subcategory,
        authority: signer.publicKey,
        systemProgram: SystemProgram.programId,
      };

      return createIndividualParticipant(args, accounts);
    });

    const options = {
      batchSize: 2,
      confirmBatchSuccess: true,
    };

    const batchResponse = await signAndSendInstructionsBatch(
      connection,
      signer,
      instructions,
      options,
    );
    assert(batchResponse.signatures.length === 2);
    assert(batchResponse.failedInstructions.length === 0);
    assert(batchResponse.errors.length === 0);
  });
});
