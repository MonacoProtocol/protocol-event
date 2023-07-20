import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PROGRAM_ID } from "../client/programId";
import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export async function getProgram() {
  const provider = getAnchorProvider();
  return Program.at(PROGRAM_ID, provider);
}

export function getAnchorProvider(): AnchorProvider {
  return AnchorProvider.env();
}

export async function sendTransaction(
  instructions: TransactionInstruction[],
  payer?: Keypair,
) {
  const tx = new Transaction();
  instructions.forEach((instruction) => tx.add(instruction));
  const provider = getAnchorProvider();
  const signer = payer ? payer : (provider.wallet as NodeWallet).payer;
  await sendAndConfirmTransaction(provider.connection, tx, [signer]);
}
