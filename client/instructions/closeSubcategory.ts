import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CloseSubcategoryAccounts {
  subcategory: PublicKey
  authority: PublicKey
  payer: PublicKey
}

export function closeSubcategory(
  accounts: CloseSubcategoryAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.subcategory, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.payer, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([104, 188, 76, 232, 250, 60, 211, 161])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
