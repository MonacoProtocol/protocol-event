import { SystemProgram } from "@solana/web3.js";
import { findCategoryPda } from "./pda";
import { getProgram, sendTransaction } from "./util";
import {
  createCategory as clientCreateCategory,
  CreateCategoryAccounts,
  CreateCategoryArgs,
} from "../client";

export async function createCategory() {
  if (process.argv.length < 4) {
    console.log("Usage: yarn run createCategory <CODE> <NAME>");
    process.exit(1);
  }

  const code = process.argv[3];
  const name = process.argv[4];

  const program = await getProgram();

  const categoryPk = await findCategoryPda(code, program);

  const createCategoryArgs = {
    code: code,
    name: name,
  } as CreateCategoryArgs;

  const createCategoryAccounts = {
    category: categoryPk,
    payer: program.provider.publicKey,
    systemProgram: SystemProgram.programId,
  } as CreateCategoryAccounts;

  const ix = await clientCreateCategory(
    createCategoryArgs,
    createCategoryAccounts,
  );

  await sendTransaction([ix]);

  console.log(`{"categoryPk": "${categoryPk.toBase58()}"}`);
}
