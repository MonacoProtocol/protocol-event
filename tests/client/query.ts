import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  createCategory,
  createEvent,
  createEventGroup,
  createIndividualParticipant,
  createTeamParticipant,
  createWalletWithBalance,
  sendTransaction,
} from "../util/test_util";
import { CreateEventInfo } from "../util/constants";
import {
  eplEventGroupPda,
  footballCategoryPda,
  sportClassificationPda,
} from "../util/pda";
import { Events } from "../../client/queries";
import assert from "assert";
import {
  activateEvent,
  ActivateEventAccounts,
  ActivateEventArgs,
} from "../../client/instructions";
import { ProtocolEvent } from "../../target/types/protocol_event";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Participants } from "../../client/queries/participantQuery";
import { Individual, Team } from "../../client/types/ParticipantType";
import { Categories } from "../../client/queries/categoryQuery";
import { EventGroups } from "../../client/queries/eventGroupQuery";

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

    const unfilteredPks = allEvents.map((event) => event.publicKey.toBase58());
    assert.ok(unfilteredPks.includes(event1Pk.toBase58()));
    assert.ok(unfilteredPks.includes(event2Pk.toBase58()));

    const allAuthorities = allEvents.map((event) =>
      event.account.authority.toBase58(),
    );
    assert.ok(allAuthorities.includes(authority1.publicKey.toBase58()));
    assert.ok(allAuthorities.includes(authority2.publicKey.toBase58()));

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
    assert.ok(
      inactiveEvents
        .map((e) => e.publicKey.toBase58())
        .includes(event1Pk.toBase58()),
    );

    const activeEvents = await Events.eventQuery(connection)
      .filterByActive(false)
      .fetch();
    assert.ok(
      activeEvents
        .map((e) => e.publicKey.toBase58())
        .includes(event2Pk.toBase58()),
    );
  });

  it("Fetch participants using query", async () => {
    const program = anchor.workspace.ProtocolEvent as Program<ProtocolEvent>;
    const connection = program.provider.connection;

    const individual1 = await createIndividualParticipant(
      program,
      footballCategoryPda(),
      "P1",
      "Participant 1",
    );
    const individual2 = await createIndividualParticipant(
      program,
      footballCategoryPda(),
      "P2",
      "Participant 2",
    );
    const team1 = await createTeamParticipant(
      program,
      footballCategoryPda(),
      "P3",
      "Participant 3",
    );

    // fetch all participants

    const allParticipants = await Participants.participantQuery(
      connection,
    ).fetch();

    const unfilteredPks = allParticipants.map((participant) =>
      participant.publicKey.toBase58(),
    );
    assert.ok(unfilteredPks.includes(individual1.toBase58()));
    assert.ok(unfilteredPks.includes(individual2.toBase58()));
    assert.ok(unfilteredPks.includes(team1.toBase58()));

    // fetch participants by ParticipantType

    const individualParticipants = await Participants.participantQuery(
      connection,
    )
      .filterByParticipantType(new Individual())
      .fetch();

    // only Individual participants should be returned

    const individualParticipantPks = individualParticipants.map((participant) =>
      participant.publicKey.toBase58(),
    );
    assert.ok(individualParticipantPks.includes(individual1.toBase58()));
    assert.ok(individualParticipantPks.includes(individual2.toBase58()));
    assert.ok(!individualParticipantPks.includes(team1.toBase58()));

    const teamParticipants = await Participants.participantQuery(connection)
      .filterByParticipantType(new Team())
      .fetch();

    // only Team participants should be returned

    const teamParticipantPks = teamParticipants.map((participant) =>
      participant.publicKey.toBase58(),
    );
    assert.ok(!teamParticipantPks.includes(individual1.toBase58()));
    assert.ok(!teamParticipantPks.includes(individual2.toBase58()));
    assert.ok(teamParticipantPks.includes(team1.toBase58()));
  });

  it("Fetch categories using query", async () => {
    const program = anchor.workspace.ProtocolEvent as Program<ProtocolEvent>;
    const connection = program.provider.connection;

    const categoryPk = await createCategory(
      program,
      sportClassificationPda(),
      "C1",
      "Test Category 1",
    );

    const allCategories = await Categories.categoryQuery(connection).fetch();

    const unfilteredPks = allCategories.map((category) =>
      category.publicKey.toBase58(),
    );
    assert.ok(unfilteredPks.includes(categoryPk.toBase58()));
  });

  it("Fetch event groups using query", async () => {
    const program = anchor.workspace.ProtocolEvent as Program<ProtocolEvent>;
    const connection = program.provider.connection;

    const eventGroupPk = await createEventGroup(
      program,
      footballCategoryPda(),
      "EG1",
      "Test Event Group 1",
    );

    const allEventGroups = await EventGroups.eventGroupQuery(
      connection,
    ).fetch();

    const unfilteredPks = allEventGroups.map((eventGroup) =>
      eventGroup.publicKey.toBase58(),
    );
    assert.ok(unfilteredPks.includes(eventGroupPk.toBase58()));
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
