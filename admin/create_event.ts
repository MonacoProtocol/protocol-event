import * as anchor from "@project-serum/anchor";
import { SystemProgram } from "@solana/web3.js";
import { findEventPda, getProgram, getAnchorProvider } from "./util";

if (process.argv.length < 6) {
  console.log(
    "Usage: yarn run createEvent <SLUG> <NAME> <START_TIME_MS> <PARTICIPANTS_ARRAY> [ORACLE] [REFERENCE]",
  );
  process.exit(1);
}

const slug = process.argv[2];
const name = process.argv[3];
const startTime = Number.parseInt(process.argv[4]);
const participants = JSON.parse(process.argv[5]) as string[];
const oracle = process.argv.length >= 7 ? process.argv[6] : "BetDEX";
const reference = process.argv.length >= 8 ? process.argv[7] : slug;

getProgram().then(async (program) => {
  const provider = getAnchorProvider();
  const eventPk = await findEventPda(slug, program);
  console.log(`{"eventPk": "${eventPk.toBase58()}"}`);
  await program.methods
    .createEvent(
      slug,
      name,
      new anchor.BN(startTime),
      participants,
      oracle,
      reference,
    )
    .accounts({
      event: eventPk,
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
});
