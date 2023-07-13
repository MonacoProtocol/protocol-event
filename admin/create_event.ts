import { SystemProgram } from "@solana/web3.js";
import { findEventPda, getProgram } from "./util";
import { CreateEventInfo } from "../tests/util/constants";

if (process.argv.length < 8) {
  console.log(
    "Usage: yarn run createEvent <CODE> <NAME> <CATEGORY_PK> <EVENT_GROUP_PK> <EXPECTED_START_TIMESTAMP> <PARTICIPANTS_ARRAY>",
  );
  process.exit(1);
}

const code = process.argv[2];
const name = process.argv[3];
const categoryPk = process.argv[4];
const eventGroupPk = process.argv[5];
const startTime = Number.parseInt(process.argv[6]);
const participants = JSON.parse(process.argv[7]) as number[];

getProgram().then(async (program) => {
  const eventPk = await findEventPda(code, program);

  console.log(`{"eventPk": "${eventPk.toBase58()}"}`);
  const createEventInfo = {
    code: code,
    name: name,
    participants: participants,
    expectedStartTimestamp: startTime,
    actualStartTimestamp: null,
    actualEndTimestamp: null,
  } as CreateEventInfo;

  await program.methods
    .createEvent(createEventInfo)
    .accounts({
      event: eventPk,
      category: categoryPk,
      eventGroup: eventGroupPk,
      authority: program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
});
