import * as anchor from "@project-serum/anchor";
import assert from "assert";
import { Program } from "@project-serum/anchor";
import { createEventAccount, findEventPda } from "../util/test_util";

describe("Create Event", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  it("Create Event - Success", async () => {
    const eventProgram = anchor.workspace.Externalevent;

    const name = "TEST NAME";
    const slug = "test-name";
    const startTime = 1924200000;

    const oracle = "TEST ORACLE";
    const reference = "TEST REFERENCE";

    const participants = ["A", "B", "C"];

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      name,
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
