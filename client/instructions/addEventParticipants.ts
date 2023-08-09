import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AddEventParticipantsArgs {
  code: string
  participantsToAdd: Array<number>
}

export interface AddEventParticipantsAccounts {
  event: PublicKey
  subcategory: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  borsh.str("code"),
  borsh.vec(borsh.u16(), "participantsToAdd"),
])

export function addEventParticipants(
  args: AddEventParticipantsArgs,
  accounts: AddEventParticipantsAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.event, isSigner: false, isWritable: true },
    { pubkey: accounts.subcategory, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([143, 123, 25, 114, 60, 0, 185, 130])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      code: args.code,
      participantsToAdd: args.participantsToAdd,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
