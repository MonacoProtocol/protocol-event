import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateTeamParticipantArgs {
  code: string
  name: string
}

export interface CreateTeamParticipantAccounts {
  participant: PublicKey
  category: PublicKey
  authority: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.str("code"), borsh.str("name")])

export function createTeamParticipant(
  args: CreateTeamParticipantArgs,
  accounts: CreateTeamParticipantAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.participant, isSigner: false, isWritable: true },
    { pubkey: accounts.category, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([4, 136, 45, 172, 223, 55, 35, 176])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      code: args.code,
      name: args.name,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
