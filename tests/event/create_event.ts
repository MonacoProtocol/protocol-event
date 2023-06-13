import * as anchor from "@coral-xyz/anchor";
import assert from "assert";
import { Program } from "@coral-xyz/anchor";
import { createEventAccount, findEventPda } from "../util/test_util";
import { EventType } from "../util/constants";

describe("Create Event", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  it("Create Event - Success", async () => {
    const eventProgram = anchor.workspace.ProtocolEvent;

    const name = "TEST NAME";
    const slug = "test-name";
    const eventType = EventType.AVB;
    const startTime = 1924200000;

    const oracle = "TEST ORACLE";
    const reference = "TEST REFERENCE";

    const participants = ["A", "B", "C"];

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      name,
      eventType,
      startTime,
      participants,
      oracle,
      reference,
      eventPk,
      eventProgram,
      provider,
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);

    assert.equal(createdAccount.name, name);
    assert.equal(createdAccount.slug, slug);
    assert.equal(createdAccount.startExpectedTimestamp.toNumber(), startTime);
  });
});
