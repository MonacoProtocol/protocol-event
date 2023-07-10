import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import assert from "assert";
import { createEventAccount } from "../util/test_util";
import { ProtocolEvent } from "../../target/types/protocol_event";
import { CreateEventInfo } from "../util/constants";
import {
  eplEventGroupPda,
  findEventPda,
  footballCategoryPda,
} from "../util/pda";
import { getAnchorProvider } from "../../admin/util";

describe("Update Event", () => {
  it("Update Event - Mark active & inactive", async () => {
    const eventProgram = anchor.workspace
      .ProtocolEvent as Program<ProtocolEvent>;

    const slug = "EVENT-TO-UPDATE-3";

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    const createEventInfo = {
      slug: slug,
      name: "TEST NAME",
      participants: [],
      expectedStartTimestamp: new anchor.BN(1924200000),
      actualStartTimestamp: null,
      actualEndTimestamp: null,
    } as CreateEventInfo;
    await createEventAccount(
      createEventInfo,
      footballCategoryPda(),
      eplEventGroupPda(),
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(createdAccount.active, false);

    await eventProgram.methods
      .activateEvent(slug)
      .accounts({
        event: eventPk,
        category: footballCategoryPda(),
        authority: getAnchorProvider().wallet.publicKey,
      })
      .rpc();

    const activatedEvent = await eventProgram.account.event.fetch(eventPk);
    assert.equal(activatedEvent.active, true);

    await eventProgram.methods
      .deactivateEvent(slug)
      .accounts({
        event: eventPk,
        category: footballCategoryPda(),
        authority: getAnchorProvider().wallet.publicKey,
      })
      .rpc();

    const deactivatedEvent = await eventProgram.account.event.fetch(eventPk);
    assert.equal(deactivatedEvent.active, false);
  });
});
