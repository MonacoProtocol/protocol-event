import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CloseEventAccounts {
  event: PublicKey
  authority: PublicKey
  payer: PublicKey
}

export function closeEvent(
  accounts: CloseEventAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.event, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.payer, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([117, 114, 193, 54, 49, 25, 75, 194])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
