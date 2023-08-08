import { PublicKey, SystemProgram } from "@solana/web3.js";
import { findEventPda } from "./pda";
import { getProgram, sendTransaction } from "./util";
import {
  createEvent as clientEventCreate,
  CreateEventAccounts,
  CreateEventArgs,
  CreateEventInfoFields,
  addEventParticipants as clientAddEventParticipants,
  removeEventParticipants as clientRemoveEventParticipants,
  activateEvent as clientActivateEvent,
  activateEvent as clientDeactivateEvent,
  AddEventParticipantsArgs,
  AddEventParticipantsAccounts,
  RemoveEventParticipantsArgs,
  RemoveEventParticipantsAccounts,
  ActivateEventArgs,
  ActivateEventAccounts,
  DeactivateEventArgs,
  DeactivateEventAccounts,
} from "../client";
import { BN } from "@coral-xyz/anchor";

export async function createEvent() {
  if (process.argv.length < 7) {
    console.log(
      "Usage: yarn run createEvent <CODE> <NAME> <CATEGORY_PK> <EVENT_GROUP_PK> <EXPECTED_START_TIMESTAMP>",
    );
    process.exit(1);
  }

  const code = process.argv[3];
  const name = process.argv[4];
  const subcategoryPk = new PublicKey(process.argv[5]);
  const eventGroupPk = new PublicKey(process.argv[6]);
  const startTime = Number.parseInt(process.argv[7]);

  const program = await getProgram();

  const eventPk = await findEventPda(code, program);

  const createEventArgs = {
    eventInfo: {
      code: code,
      name: name,
      participants: [],
      expectedStartTimestamp: new BN(startTime),
      actualStartTimestamp: null,
      actualEndTimestamp: null,
    } as CreateEventInfoFields,
  } as CreateEventArgs;

  const createEventAccs = {
    event: eventPk,
    eventGroup: eventGroupPk,
    category: subcategoryPk,
    authority: program.provider.publicKey,
    systemProgram: SystemProgram.programId,
  } as CreateEventAccounts;

  const ix = await clientEventCreate(createEventArgs, createEventAccs);

  await sendTransaction([ix]);

  console.log(`{"eventPk": "${eventPk.toBase58()}"}`);
}

export async function addEventParticipants() {
  if (process.argv.length < 4) {
    console.log(
      "Usage: yarn run addEventParticipants <EVENT_PK> [<PARTICIPANT_IDS>]",
    );
    process.exit(1);
  }

  const eventPk = new PublicKey(process.argv[3]);
  const participants = process.argv[4];

  const program = await getProgram();
  const event = await program.account.event.fetch(eventPk);

  const addEventParticipantsArgs = {
    code: event.code,
    participantsToAdd: participants
      .slice(1, -1)
      .split(",")
      .map((id) => parseInt(id)),
  } as AddEventParticipantsArgs;

  const addEventParticipantsAccounts = {
    event: eventPk,
    category: event.category,
    authority: program.provider.publicKey,
  } as AddEventParticipantsAccounts;

  const ix = clientAddEventParticipants(
    addEventParticipantsArgs,
    addEventParticipantsAccounts,
  );

  await sendTransaction([ix]);

  console.log(`{"eventPk": "${eventPk.toBase58()}"}`);
}

export async function removeEventParticipants() {
  if (process.argv.length < 4) {
    console.log(
      "Usage: yarn run removeEventParticipants <EVENT_PK> [<PARTICIPANT_IDS>]",
    );
    process.exit(1);
  }

  const eventPk = new PublicKey(process.argv[3]);
  const participants = process.argv[4];

  const program = await getProgram();
  const event = await program.account.event.fetch(eventPk);

  const removeEventParticipantsArgs = {
    code: event.code,
    participantsToRemove: participants
      .slice(1, -1)
      .split(",")
      .map((id) => parseInt(id)),
  } as RemoveEventParticipantsArgs;

  const removeEventParticipantsAccounts = {
    event: eventPk,
    category: event.category,
    authority: program.provider.publicKey,
  } as RemoveEventParticipantsAccounts;

  const ix = clientRemoveEventParticipants(
    removeEventParticipantsArgs,
    removeEventParticipantsAccounts,
  );

  await sendTransaction([ix]);

  console.log(`{"eventPk": "${eventPk.toBase58()}"}`);
}

export async function activateEvent() {
  if (process.argv.length < 4) {
    console.log("Usage: yarn run activateEvent <EVENT_PK>");
    process.exit(1);
  }

  const eventPk = new PublicKey(process.argv[3]);

  const program = await getProgram();
  const event = await program.account.event.fetch(eventPk);

  const activateEventArgs = {
    code: event.code,
  } as ActivateEventArgs;

  const activateEventAccounts = {
    event: eventPk,
    category: event.category,
    authority: program.provider.publicKey,
  } as ActivateEventAccounts;

  const ix = clientActivateEvent(activateEventArgs, activateEventAccounts);

  await sendTransaction([ix]);

  console.log(`{"eventPk": "${eventPk.toBase58()}"}`);
}

export async function deactivateEvent() {
  if (process.argv.length < 4) {
    console.log("Usage: yarn run deactivateEvent <EVENT_PK>");
    process.exit(1);
  }

  const eventPk = new PublicKey(process.argv[3]);

  const program = await getProgram();
  const event = await program.account.event.fetch(eventPk);

  const deactivateEventArgs = {
    code: event.code,
  } as DeactivateEventArgs;

  const deactivateEventAccounts = {
    event: eventPk,
    category: event.category,
    authority: program.provider.publicKey,
  } as DeactivateEventAccounts;

  const ix = clientDeactivateEvent(
    deactivateEventArgs,
    deactivateEventAccounts,
  );

  await sendTransaction([ix]);

  console.log(`{"eventPk": "${eventPk.toBase58()}"}`);
}
