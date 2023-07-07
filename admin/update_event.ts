import * as anchor from "@coral-xyz/anchor";
import { findEventPda, getProgram, getAnchorProvider } from "./util";

if (process.argv.length < 4) {
  console.log(
    "Usage: yarn run updateEvent <SLUG> <FIELD|COMMAND> [<PARAM>, ...]",
  );
  process.exit(1);
}

const slug = process.argv[2];
const updateTask = process.argv[3];

switch (updateTask) {
  case "score":
    updateScore();
    break;
  case "startTime":
    updateStartTime();
    break;
  case "period":
    updatePeriod();
    break;
  case "participants":
    updateParticipants();
    break;
  case "activate":
    activate();
    break;
  case "deactivate":
    deactivate();
    break;
  case "start":
    start();
    break;
  case "complete":
    complete();
    break;
  default:
    console.error(
      "Available fields to update : score, startTime, period, participants\nAvailable update commands: activate, deactivate, start, complete",
    );
}

function updateScore() {
  if (process.argv.length < 5) {
    console.log("Expected score string missing");
    process.exit(1);
  }
  const score = process.argv[4];
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .updateScore(slug, score)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}

function updateStartTime() {
  if (process.argv.length < 5) {
    console.log("Expected startTimestamp in seconds missing");
    process.exit(1);
  }
  const startTime = new anchor.BN(Number.parseInt(process.argv[4]));
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .setStartTimestamp(slug, startTime)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}

function updatePeriod() {
  if (process.argv.length < 5) {
    console.log("Expected period missing");
    process.exit(1);
  }
  const period = Number.parseInt(process.argv[4]);
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .updatePeriod(slug, period)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}

function updateParticipants() {
  if (process.argv.length < 5) {
    console.log("Expected participants string missing");
    process.exit(1);
  }
  const participants = JSON.parse(process.argv[4]);
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .updateEventParticipants(slug, participants)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}

function activate() {
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .activateEvent(slug)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}

function deactivate() {
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .deactivateEvent(slug)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}

function start() {
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .startEvent(slug)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}

function complete() {
  getProgram().then(async (program) => {
    const provider = getAnchorProvider();
    const eventPk = await findEventPda(slug, program);
    await program.methods
      .completeEvent(slug)
      .accounts({
        event: eventPk,
        authority: provider.wallet.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });
  });
}
