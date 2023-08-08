import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { findParticipantPda } from "./pda";
import { getProgram, sendTransaction } from "./util";
import {
  createIndividualParticipant as clientCreateIndividualParticipant,
  CreateIndividualParticipantAccounts,
  CreateIndividualParticipantArgs,
  createTeamParticipant as clientCreateTeamParticipant,
  CreateTeamParticipantAccounts,
  CreateTeamParticipantArgs,
} from "../client";
import { Program } from "@coral-xyz/anchor";

export async function createParticipant() {
  if (process.argv.length < 6) {
    console.log(
      "Usage: yarn run createParticipant <TEAM|INDIVIDUAL> <CATEGORY_PK> <CODE> <NAME>",
    );
    process.exit(1);
  }

  const participantType = process.argv[3];
  const subcategoryPk = new PublicKey(process.argv[4]);
  const code = process.argv[5];
  const name = process.argv[6];

  const program = await getProgram();

  const participantPk = await findParticipantPda(subcategoryPk, program);

  let ix;
  switch (participantType) {
    case "TEAM":
      ix = await createTeamParticipantInstruction(
        subcategoryPk,
        code,
        name,
        participantPk,
        program,
      );
      break;
    case "INDIVIDUAL":
      ix = await createIndividualParticipantInstruction(
        subcategoryPk,
        code,
        name,
        participantPk,
        program,
      );
      break;
    default:
      throw new Error(
        `Invalid participant type: ${participantType} - valid options are TEAM or INDIVIDUAL`,
      );
  }

  await sendTransaction([ix]);

  console.log(`{"participantPk": "${participantPk.toBase58()}"}`);
}

function createTeamParticipantInstruction(
  subcategoryPk: PublicKey,
  code: string,
  name: string,
  participantPk: PublicKey,
  program: Program,
): TransactionInstruction {
  const createParticipantArgs = {
    code: code,
    name: name,
  } as CreateTeamParticipantArgs;
  const createParticipantAccounts = {
    participant: participantPk,
    subcategory: subcategoryPk,
    authority: program.provider.publicKey,
    systemProgram: SystemProgram.programId,
  } as CreateTeamParticipantAccounts;
  return clientCreateTeamParticipant(
    createParticipantArgs,
    createParticipantAccounts,
  );
}

function createIndividualParticipantInstruction(
  subcategoryPk: PublicKey,
  code: string,
  name: string,
  participantPk: PublicKey,
  program: Program,
): TransactionInstruction {
  const createParticipantArgs = {
    code: code,
    name: name,
  } as CreateIndividualParticipantArgs;
  const createParticipantAccounts = {
    participant: participantPk,
    subcategory: subcategoryPk,
    authority: program.provider.publicKey,
    systemProgram: SystemProgram.programId,
  } as CreateIndividualParticipantAccounts;
  return clientCreateIndividualParticipant(
    createParticipantArgs,
    createParticipantAccounts,
  );
}
