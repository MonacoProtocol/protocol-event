import * as anchor from "@project-serum/anchor";
import assert from "assert";
import { Program } from "@project-serum/anchor";
import { createEventAccount, findEventPda } from "../util/test_util";
import { Externalevent } from "../../target/types/externalevent";
import { EventType } from "../util/constants";

describe("Update Event", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  it("Update Event - Score updated", async () => {
    const eventProgram = anchor.workspace
      .Externalevent as Program<Externalevent>;

    const slug = "EVENT-TO-UPDATE";

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      "EVENT TO UPDATE",
      EventType.AVB,
      1924200000,
      ["A", "B", "C"],
      "TEST ORACLE",
      "TEST REFERENCE",
      eventPk,
      eventProgram,
      provider,
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(createdAccount.currentScore, null);

    await eventProgram.methods
      .updateScore(slug, "an score")
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const updateAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(updateAccount.currentScore, "an score");
  });

  it("Update Event - Period updated", async () => {
    const eventProgram = anchor.workspace
      .Externalevent as Program<Externalevent>;

    const slug = "EVENT-TO-UPDATE-2";

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      "EVENT TO UPDATE 2",
      EventType.AVB,
      1924200000,
      ["A", "B", "C"],
      "TEST ORACLE",
      "TEST REFERENCE",
      eventPk,
      eventProgram,
      provider,
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(createdAccount.currentPeriod, null);

    await eventProgram.methods
      .updatePeriod(slug, new anchor.BN(1))
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const updateAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(updateAccount.currentPeriod, 1);
  });

  it("Update Event - Mark active & inactive", async () => {
    const eventProgram = anchor.workspace
      .Externalevent as Program<Externalevent>;

    const slug = "EVENT-TO-UPDATE-3";

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      "EVENT TO UPDATE 3",
      EventType.AVB,
      1924200000,
      ["A", "B", "C"],
      "TEST ORACLE",
      "TEST REFERENCE",
      eventPk,
      eventProgram,
      provider,
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(createdAccount.active, false);

    await eventProgram.methods
      .activateEvent(slug)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const activatedEvent = await eventProgram.account.event.fetch(eventPk);
    assert.equal(activatedEvent.active, true);

    await eventProgram.methods
      .deactivateEvent(slug)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const deactivatedEvent = await eventProgram.account.event.fetch(eventPk);
    assert.equal(deactivatedEvent.active, false);
  });

  it("Update Event - Status updated", async () => {
    const eventProgram = anchor.workspace
      .Externalevent as Program<Externalevent>;

    const slug = "EVENT-TO-UPDATE-4";

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      "EVENT TO UPDATE 4",
      EventType.AVB,
      1924200000,
      ["A", "B", "C"],
      "TEST ORACLE",
      "TEST REFERENCE",
      eventPk,
      eventProgram,
      provider,
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);
    assert.deepEqual(createdAccount.status, { upcoming: {} });

    await eventProgram.methods
      .startEvent(slug)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const updateAccount = await eventProgram.account.event.fetch(eventPk);
    assert.deepEqual(updateAccount.status, { started: {} });
  });

  it("Update Event - Participants updated", async () => {
    const eventProgram = anchor.workspace
      .Externalevent as Program<Externalevent>;

    const slug = "EVENT-TO-UPDATE-5";
    const participants = ["A", "B", "C"];

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      "EVENT TO UPDATE 5",
      EventType.AVB,
      1924200000,
      participants,
      "TEST ORACLE",
      "TEST REFERENCE",
      eventPk,
      eventProgram,
      provider,
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);
    assert.deepEqual(createdAccount.participants, participants);

    const updatedParticipants = ["X", "Y", "Z"];

    await eventProgram.methods
      .updateParticipants(slug, updatedParticipants)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const updateAccount = await eventProgram.account.event.fetch(eventPk);
    assert.deepEqual(updateAccount.participants, updatedParticipants);
  });

  it("Update Event - Update start timestamp", async () => {
    const eventProgram = anchor.workspace
      .Externalevent as Program<Externalevent>;

    const slug = "EVENT-TO-UPDATE-6";

    // pda for new Event state account
    const eventPk = await findEventPda(slug, eventProgram as Program);
    await createEventAccount(
      slug,
      "EVENT TO UPDATE 6",
      EventType.AVB,
      1924200000,
      ["A", "B", "C"],
      "TEST ORACLE",
      "TEST REFERENCE",
      eventPk,
      eventProgram,
      provider,
    );

    const createdAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(createdAccount.startExpectedTimestamp.toNumber(), 1924200000);

    const updatedStartTime = 1925200000;

    await eventProgram.methods
      .setStartTimestamp(slug, new anchor.BN(updatedStartTime))
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const updateAccount = await eventProgram.account.event.fetch(eventPk);
    assert.equal(
      updateAccount.startExpectedTimestamp.toNumber(),
      updatedStartTime,
    );
  });
});
