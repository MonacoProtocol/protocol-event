import * as anchor from "@coral-xyz/anchor";
import assert from "assert";
import { Program } from "@coral-xyz/anchor";
import { createEventAccount, findEventPda } from "../util/test_util";
import { Category, CreateEventInfo, EventGroup } from "../util/constants";

describe("Create Event", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  it("Create Event - Success", async () => {
    const eventProgram = anchor.workspace.ProtocolEvent;
    const name = "TEST NAME";
    const slug = "test-name";
    const startTime = 1924200000;
    const category = {
      id: "TEST CATEGORY ID",
      name: "TEST CATEGORY NAME",
    } as Category;
    const eventGroup = {
      id: "TEST EVENT GROUP ID",
      name: "TEST EVENT GROUP NAME",
    } as EventGroup;

    const createEventInfo = {
      category: category,
      eventGroup: eventGroup,
      slug: slug,
      name: name,
      participants: [],
      expectedStartTimestamp: new anchor.BN(startTime),
      actualStartTimestamp: null,
      actualEndTimestamp: null,
    } as CreateEventInfo;

    await createEventAccount(createEventInfo, eventProgram);

    const eventPk = await findEventPda(slug, eventProgram as Program);
    const createdAccount = await eventProgram.account.event.fetch(eventPk);

    assert.equal(createdAccount.name, name);
    assert.equal(createdAccount.slug, slug);
    assert.equal(createdAccount.expectedStartTimestamp.toNumber(), startTime);
  });
});
