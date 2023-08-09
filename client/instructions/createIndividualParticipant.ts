import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateIndividualParticipantArgs {
  code: string
  name: string
}

export interface CreateIndividualParticipantAccounts {
  participant: PublicKey
  subcategory: PublicKey
  authority: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.str("code"), borsh.str("name")])

export function createIndividualParticipant(
  args: CreateIndividualParticipantArgs,
  accounts: CreateIndividualParticipantAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.participant, isSigner: false, isWritable: true },
    { pubkey: accounts.subcategory, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([13, 139, 27, 34, 194, 7, 118, 198])
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
