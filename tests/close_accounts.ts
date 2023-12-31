import {
  createSubcategory,
  createEvent,
  createEventGroup,
  createIndividualParticipant,
  createTeamParticipant,
  createWalletWithBalance,
} from "./util/test_util";
import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { ProtocolEvent } from "../target/types/protocol_event";
import assert from "assert";
import { sportCategoryPda } from "./util/pda";

describe("Close Accounts", () => {
  it("Success", async () => {
    const program = anchor.workspace.ProtocolEvent as Program<ProtocolEvent>;

    const payer = await createWalletWithBalance();

    const subcategoryPk = await createSubcategory(
      program,
      sportCategoryPda(),
      "CLOSE",
      "To Close",
      payer,
    );
    const eventGroupPk = await createEventGroup(
      program,
      subcategoryPk,
      "CLOSE",
      "To Close",
      payer,
    );
    const individualPk = await createIndividualParticipant(
      program,
      subcategoryPk,
      "CLOSE",
      "To Close",
      payer,
    );
    const teamPk = await createTeamParticipant(
      program,
      subcategoryPk,
      "CLOSE",
      "To Close",
      payer,
    );
    const eventPk = await createEvent(
      {
        code: "CLOSE",
        name: "TO CLOSE",
        participants: [],
        actualEndTimestamp: null,
        actualStartTimestamp: null,
        expectedStartTimestamp: new BN(1689169672),
      },
      subcategoryPk,
      eventGroupPk,
      payer,
    );

    await program.methods
      .closeSubcategory()
      .accounts({
        subcategory: subcategoryPk,
        authority: payer.publicKey,
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();
    await assertAccountClosed(program.account.subcategory.fetch(subcategoryPk));

    await program.methods
      .closeEventGroup()
      .accounts({
        eventGroup: eventGroupPk,
        authority: payer.publicKey,
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();
    await assertAccountClosed(program.account.eventGroup.fetch(eventGroupPk));

    await program.methods
      .closeParticipant()
      .accounts({
        participant: individualPk,
        authority: payer.publicKey,
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();
    await assertAccountClosed(program.account.participant.fetch(individualPk));

    await program.methods
      .closeParticipant()
      .accounts({
        participant: teamPk,
        authority: payer.publicKey,
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();
    await assertAccountClosed(program.account.participant.fetch(teamPk));

    await program.methods
      .closeEvent()
      .accounts({
        event: eventPk,
        authority: payer.publicKey,
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();
    await assertAccountClosed(program.account.event.fetch(eventPk));

    const closingBalance = await program.provider.connection.getBalance(
      payer.publicKey,
    );
    assert.equal(closingBalance, 1000000000);
  });
});

async function assertAccountClosed(promise: Promise<any>) {
  try {
    await promise;
    assert.fail("Account should not exist");
  } catch (e) {
    assert.ok(e.message.startsWith("Account does not exist or has no data"));
  }
}
