import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateEventGroupNameArgs {
  updatedName: string
}

export interface UpdateEventGroupNameAccounts {
  eventGroup: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([borsh.str("updatedName")])

export function updateEventGroupName(
  args: UpdateEventGroupNameArgs,
  accounts: UpdateEventGroupNameAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.eventGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([245, 12, 194, 240, 175, 123, 193, 54])
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
