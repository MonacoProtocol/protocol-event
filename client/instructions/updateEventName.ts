import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateEventNameArgs {
  code: string
  updatedName: string
}

export interface UpdateEventNameAccounts {
  event: PublicKey
  category: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  borsh.str("code"),
  borsh.str("updatedName"),
])

export function updateEventName(
  args: UpdateEventNameArgs,
  accounts: UpdateEventNameAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.event, isSigner: false, isWritable: true },
    { pubkey: accounts.category, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([145, 242, 210, 78, 232, 148, 63, 216])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      code: args.code,
      updatedName: args.updatedName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
