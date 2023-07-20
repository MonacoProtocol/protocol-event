import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DeactivateParticipantAccounts {
  participant: PublicKey
  authority: PublicKey
}

export function deactivateParticipant(
  accounts: DeactivateParticipantAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.participant, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([127, 38, 60, 19, 79, 98, 41, 55])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
