import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import assert from "assert";
import { createEventAccount } from "../util/test_util";
import { CreateEventInfo } from "../util/constants";
import {
  eplEventGroupPda,
  findEventPda,
  footballCategoryPda,
} from "../util/pda";

describe("Create Event", () => {
  it("Create Event - Success", async () => {
    const eventProgram = anchor.workspace.ProtocolEvent;
    const name = "TEST NAME";
    const slug = "test-name";
    const startTime = 1924200000;

    const createEventInfo = {
      slug: slug,
      name: name,
      participants: [],
      expectedStartTimestamp: new anchor.BN(startTime),
      actualStartTimestamp: null,
      actualEndTimestamp: null,
    } as CreateEventInfo;

    await createEventAccount(
      createEventInfo,
      footballCategoryPda(),
      eplEventGroupPda(),
      eventProgram,
    );

    const eventPk = await findEventPda(slug, eventProgram as Program);
    const createdAccount = await eventProgram.account.event.fetch(eventPk);

    assert.equal(createdAccount.name, name);
    assert.equal(createdAccount.slug, slug);
    assert.equal(createdAccount.expectedStartTimestamp.toNumber(), startTime);
  });
});
