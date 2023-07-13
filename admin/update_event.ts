import * as anchor from "@coral-xyz/anchor";
import { findEventPda, getProgram, getAnchorProvider } from "./util";

if (process.argv.length < 4) {
  console.log(
    "Usage: yarn run updateEvent <CODE> <FIELD|COMMAND> [<PARAM>, ...]",
  );
  process.exit(1);
}

const code = process.argv[2];
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .updateScore(code, score)
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .setStartTimestamp(code, startTime)
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .updatePeriod(code, period)
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .updateEventParticipants(code, participants)
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .activateEvent(code)
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .deactivateEvent(code)
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .startEvent(code)
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
    const eventPk = await findEventPda(code, program);
    await program.methods
      .completeEvent(code)
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
