import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateClassificationNameArgs {
  updatedName: string
}

export interface UpdateClassificationNameAccounts {
  classification: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([borsh.str("updatedName")])

export function updateClassificationName(
  args: UpdateClassificationNameArgs,
  accounts: UpdateClassificationNameAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.classification, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([78, 156, 88, 38, 217, 65, 218, 15])
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
