import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RemoveEventParticipantsArgs {
  code: string
  participantsToRemove: Array<number>
}

export interface RemoveEventParticipantsAccounts {
  event: PublicKey
  category: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  borsh.str("code"),
  borsh.vec(borsh.u16(), "participantsToRemove"),
])

export function removeEventParticipants(
  args: RemoveEventParticipantsArgs,
  accounts: RemoveEventParticipantsAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.event, isSigner: false, isWritable: true },
    { pubkey: accounts.category, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([99, 117, 159, 182, 180, 152, 35, 157])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      code: args.code,
      participantsToRemove: args.participantsToRemove,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
