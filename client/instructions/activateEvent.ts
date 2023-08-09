import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ActivateEventArgs {
  code: string
}

export interface ActivateEventAccounts {
  event: PublicKey
  subcategory: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([borsh.str("code")])

export function activateEvent(
  args: ActivateEventArgs,
  accounts: ActivateEventAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.event, isSigner: false, isWritable: true },
    { pubkey: accounts.subcategory, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([231, 184, 218, 110, 194, 0, 39, 115])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      code: args.code,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
