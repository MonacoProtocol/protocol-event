import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CloseClassificationAccounts {
  category: PublicKey
  authority: PublicKey
  payer: PublicKey
}

export function closeClassification(
  accounts: CloseClassificationAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.category, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.payer, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([3, 93, 204, 31, 46, 199, 87, 46])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
