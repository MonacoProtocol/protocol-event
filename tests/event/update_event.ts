import * as anchor from "@project-serum/anchor";
import assert from "assert";
import { Program } from "@project-serum/anchor";
import { createEventAccount, findEventPda } from "../util/test_util";
import { Externalevent } from "../../target/types/externalevent";

describe("Update Event", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  it("Update Event - Score updated", async () => {
    const eventProgram = anchor.workspace
      .Externalevent as Program<Externalevent>;

    const name = "EVENT TO UPDATE";
    const startTime = 1924200000;

    // pda for new Event state account
    const eventPk = await findEventPda(
      name,
      startTime,
      eventProgram as Program,
    );
    await createEventAccount(
      name,
      startTime,
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
      .updateScore(name, new anchor.BN(startTime), "an score")
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

    const name = "EVENT TO UPDATE 2";
    const startTime = 1924200000;

    // pda for new Event state account
    const eventPk = await findEventPda(
      name,
      startTime,
      eventProgram as Program,
    );
    await createEventAccount(
      name,
      startTime,
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
      .updatePeriod(name, new anchor.BN(startTime), new anchor.BN(1))
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

    const name = "EVENT TO UPDATE 3";
    const startTime = 1924200000;

    // pda for new Event state account
    const eventPk = await findEventPda(
      name,
      startTime,
      eventProgram as Program,
    );
    await createEventAccount(
      name,
      startTime,
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
      .activateEvent(name, new anchor.BN(startTime))
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const activatedEvent = await eventProgram.account.event.fetch(eventPk);
    assert.equal(activatedEvent.active, true);

    await eventProgram.methods
      .deactivateEvent(name, new anchor.BN(startTime))
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

    const name = "EVENT TO UPDATE 4";
    const startTime = 1924200000;

    // pda for new Event state account
    const eventPk = await findEventPda(
      name,
      startTime,
      eventProgram as Program,
    );
    await createEventAccount(
      name,
      startTime,
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
      .startEvent(name, new anchor.BN(startTime))
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

    const name = "EVENT TO UPDATE 5";
    const startTime = 1924200000;
    const participants = ["A", "B", "C"];

    // pda for new Event state account
    const eventPk = await findEventPda(
      name,
      startTime,
      eventProgram as Program,
    );
    await createEventAccount(
      name,
      startTime,
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
      .updateParticipants(name, new anchor.BN(startTime), updatedParticipants)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const updateAccount = await eventProgram.account.event.fetch(eventPk);
    assert.deepEqual(updateAccount.participants, updatedParticipants);
  });
});
