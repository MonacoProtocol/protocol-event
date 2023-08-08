import { PublicKey, SystemProgram } from "@solana/web3.js";
import { findEventGroupPda } from "./pda";
import { getProgram, sendTransaction } from "./util";
import {
  createEventGroup as clientCreateEventGroup,
  CreateEventGroupAccounts,
  CreateEventGroupArgs,
} from "../client";

export async function createEventGroup() {
  if (process.argv.length < 5) {
    console.log("Usage: yarn run createEventGroup <CATEGORY_PK> <CODE> <NAME>");
    process.exit(1);
  }

  const subcategoryPk = new PublicKey(process.argv[3]);
  const code = process.argv[4];
  const name = process.argv[5];

  const program = await getProgram();

  const eventGroupPk = findEventGroupPda(subcategoryPk, code, program);

  const createEventGroupArgs = {
    code: code,
    name: name,
  } as CreateEventGroupArgs;

  const createEventGroupAccs = {
    eventGroup: eventGroupPk,
    subcategory: subcategoryPk,
    payer: program.provider.publicKey,
    systemProgram: SystemProgram.programId,
  } as CreateEventGroupAccounts;

  const ix = clientCreateEventGroup(createEventGroupArgs, createEventGroupAccs);

  await sendTransaction([ix]);

  console.log(`{"eventGroupPk": "${eventGroupPk.toBase58()}"}`);
}
