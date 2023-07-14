import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateEventArgs {
  eventInfo: types.CreateEventInfoFields
}

export interface CreateEventAccounts {
  event: PublicKey
  eventGroup: PublicKey
  category: PublicKey
  authority: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.CreateEventInfo.layout("eventInfo")])

export function createEvent(
  args: CreateEventArgs,
  accounts: CreateEventAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.event, isSigner: false, isWritable: true },
    { pubkey: accounts.eventGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.category, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([49, 219, 29, 203, 22, 98, 100, 87])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      eventInfo: types.CreateEventInfo.toEncodable(args.eventInfo),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
