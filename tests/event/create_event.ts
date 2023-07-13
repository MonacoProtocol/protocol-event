import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import assert from "assert";
import {
  addEventParticipants,
  createEvent,
  removeEventParticipants,
} from "../util/test_util";
import { CreateEventInfo } from "../util/constants";
import {
  eplEventGroupPda,
  findEventPda,
  footballCategoryPda,
} from "../util/pda";

describe("Create Event", () => {
  it("Create Event with Participants", async () => {
    const eventProgram = anchor.workspace.ProtocolEvent;
    const name = "TEST NAME";
    const code = "test-name";
    const startTime = 1924200000;

    const createEventInfo = {
      code: code,
      name: name,
      participants: [],
      expectedStartTimestamp: new anchor.BN(startTime),
      actualStartTimestamp: null,
      actualEndTimestamp: null,
    } as CreateEventInfo;

    await createEvent(
      createEventInfo,
      footballCategoryPda(),
      eplEventGroupPda(),
    );

    const eventPk = await findEventPda(code, eventProgram as Program);
    const createdAccount = await eventProgram.account.event.fetch(eventPk);

    assert.equal(createdAccount.name, name);
    assert.equal(createdAccount.code, code);
    assert.equal(createdAccount.expectedStartTimestamp.toNumber(), startTime);

    // add participants

    const participants = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    await addEventParticipants(code, participants);

    const eventWithParticipants = await eventProgram.account.event.fetch(
      eventPk,
    );
    assert.deepEqual(eventWithParticipants.participants, participants);

    // remove participants

    const toRemove = participants[0];
    await removeEventParticipants(code, [toRemove]);

    const eventWithParticipantsRemoved = await eventProgram.account.event.fetch(
      eventPk,
    );
    assert.ok(!eventWithParticipantsRemoved.participants.includes(toRemove));
    assert.deepEqual(
      eventWithParticipantsRemoved.participants,
      participants.slice(1),
    );
  });
});
