import { PublicKey, SystemProgram } from "@solana/web3.js";
import { findSubcategoryPda } from "./pda";
import { getProgram, sendTransaction } from "./util";
import {
  createSubcategory as clientCreateSubcategory,
  CreateSubcategoryAccounts,
  CreateSubcategoryArgs,
} from "../client";

export async function createSubcategory() {
  if (process.argv.length < 5) {
    console.log(
      "Usage: yarn run createSubcategory <CATEGORY_PK> <CODE> <NAME>",
    );
    process.exit(1);
  }

  const categoryPk = new PublicKey(process.argv[3]);
  const code = process.argv[4];
  const name = process.argv[5];

  const program = await getProgram();

  const subcategoryPk = findSubcategoryPda(categoryPk, code, program);

  const createSubcategoryArgs = {
    code: code,
    name: name,
  } as CreateSubcategoryArgs;

  const createSubcategoryAccounts = {
    subcategory: subcategoryPk,
    category: categoryPk,
    payer: program.provider.publicKey,
    systemProgram: SystemProgram.programId,
  } as CreateSubcategoryAccounts;

  const ix = clientCreateSubcategory(
    createSubcategoryArgs,
    createSubcategoryAccounts,
  );

  await sendTransaction([ix]);

  console.log(`{"subcategoryPk": "${subcategoryPk.toBase58()}"}`);
}
