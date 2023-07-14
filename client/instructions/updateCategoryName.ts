import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateCategoryNameArgs {
  updatedName: string
}

export interface UpdateCategoryNameAccounts {
  category: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([borsh.str("updatedName")])

export function updateCategoryName(
  args: UpdateCategoryNameArgs,
  accounts: UpdateCategoryNameAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.category, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([230, 240, 33, 142, 29, 255, 13, 19])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      updatedName: args.updatedName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
