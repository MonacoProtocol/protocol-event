import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  createEvent,
  createWalletWithBalance,
  sendTransaction,
} from "../util/test_util";
import { CreateEventInfo } from "../util/constants";
import { eplEventGroupPda, footballCategoryPda } from "../util/pda";
import { Events } from "../../client/queries";
import assert from "assert";
import {
  activateEvent,
  ActivateEventAccounts,
  ActivateEventArgs,
} from "../../client/instructions";
import { ProtocolEvent } from "../../target/types/protocol_event";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("Test Client Queries", () => {
  it("Fetch event using query", async () => {
    const program = anchor.workspace.ProtocolEvent as Program<ProtocolEvent>;
    const connection = program.provider.connection;

    const code1 = "test-name-1";
    const authority1 = await createWalletWithBalance();
    const event1Pk = await testEvent(code1, authority1);

    const code2 = "test-name-2";
    const authority2 = await createWalletWithBalance();
    const event2Pk = await testEvent(code2, authority2);

    // fetch all events

    const allEvents = await Events.eventQuery(connection).fetch();

    const unfilteredPks = allEvents.map((event) => event.publicKey);
    assert.deepEqual([event2Pk, event1Pk], unfilteredPks);

    const allAuthorities = allEvents.map((event) => event.account.authority);
    assert.deepEqual(
      [authority2.publicKey, authority1.publicKey],
      allAuthorities,
    );

    // fetch events filtered by PublicKey (authority)

    const auth1Events = await Events.eventQuery(connection)
      .filterByAuthority(authority1.publicKey)
      .fetch();

    assert.deepEqual(
      [event1Pk],
      auth1Events.map((event) => event.publicKey),
    );

    // fetch events filtered by boolean (active)

    const ix = activateEvent(
      { code: code1 } as ActivateEventArgs,
      {
        event: event1Pk,
        category: footballCategoryPda(),
        authority: authority1.publicKey,
      } as ActivateEventAccounts,
    );
    await sendTransaction([ix], authority1);

    const inactiveEvents = await Events.eventQuery(connection)
      .filterByActive(true)
      .fetch();
    assert.deepEqual(
      [event1Pk],
      inactiveEvents.map((event) => event.publicKey),
    );

    const activeEvents = await Events.eventQuery(connection)
      .filterByActive(false)
      .fetch();
    assert.deepEqual(
      [event2Pk],
      activeEvents.map((event) => event.publicKey),
    );
  });
});

async function testEvent(
  code: string,
  authority?: Keypair,
): Promise<PublicKey> {
  return await createEvent(
    {
      code: code,
      name: "Test Event",
      participants: [],
      expectedStartTimestamp: new anchor.BN(1924200000),
      actualStartTimestamp: null,
      actualEndTimestamp: null,
    } as CreateEventInfo,
    footballCategoryPda(),
    eplEventGroupPda(),
    authority,
  );
}
