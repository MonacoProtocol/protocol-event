import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProtocolEvent } from "../../target/types/protocol_event";
import { CreateEventInfo } from "./constants";
import {
  findSubcategoryPda,
  findCategoryPda,
  findEventGroupPda,
  findEventPda,
  findParticipantPda,
  footballSubcategoryPda,
} from "./pda";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getAnchorProvider } from "../../admin/util";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const { SystemProgram } = anchor.web3;

export async function createEvent(
  createEventInfo: CreateEventInfo,
  subcategoryPk: PublicKey,
  eventGroupPk: PublicKey,
  signer?: Keypair,
) {
  const program = anchor.workspace.ProtocolEvent;
  const eventPk = findEventPda(createEventInfo.code, program as Program);
  await program.methods
    .createEvent(createEventInfo)
    .accounts({
      event: eventPk,
      subcategory: subcategoryPk,
      eventGroup: eventGroupPk,
      authority: signer ? signer.publicKey : program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers(signer ? [signer] : [])
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return eventPk;
}

export async function addEventParticipants(
  eventCode: string,
  participants: number[],
) {
  const program = anchor.workspace.ProtocolEvent;
  const eventPk = findEventPda(eventCode, program as Program);

  await program.methods
    .addEventParticipants(eventCode, participants)
    .accounts({
      event: eventPk,
      subcategory: footballSubcategoryPda(),
      authority: program.provider.publicKey,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
}

export async function removeEventParticipants(
  eventCode: string,
  participants: number[],
) {
  const program = anchor.workspace.ProtocolEvent;
  const eventPk = findEventPda(eventCode, program as Program);

  await program.methods
    .removeEventParticipants(eventCode, participants)
    .accounts({
      event: eventPk,
      subcategory: footballSubcategoryPda(),
      authority: program.provider.publicKey,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
}

export async function createCategory(
  program: Program<ProtocolEvent>,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const categoryPk = findCategoryPda(code, program as Program);
  await program.methods
    .createCategory(code, name)
    .accounts({
      category: categoryPk,
      payer: signer ? signer.publicKey : program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers(signer ? [signer] : [])
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return categoryPk;
}

export async function createSubcategory(
  program: Program<ProtocolEvent>,
  categoryPk: PublicKey,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const subcategoryPk = findSubcategoryPda(
    categoryPk,
    code,
    program as Program,
  );
  await program.methods
    .createSubcategory(code, name)
    .accounts({
      subcategory: subcategoryPk,
      category: categoryPk,
      payer: signer ? signer.publicKey : program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers(signer ? [signer] : [])
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return subcategoryPk;
}

export async function createEventGroup(
  program: Program<ProtocolEvent>,
  subcategoryPk: PublicKey,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const eventGroupPk = findEventGroupPda(
    subcategoryPk,
    code,
    program as Program,
  );
  await program.methods
    .createEventGroup(code, name)
    .accounts({
      eventGroup: eventGroupPk,
      subcategory: subcategoryPk,
      payer: signer ? signer.publicKey : program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers(signer ? [signer] : [])
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return eventGroupPk;
}

export async function createIndividualParticipant(
  program: Program<ProtocolEvent>,
  subcategoryPk: PublicKey,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const subcategory = await program.account.subcategory.fetch(subcategoryPk);

  const participantPk = findParticipantPda(
    subcategoryPk,
    subcategory.participantCount,
    program as Program,
  );
  await program.methods
    .createIndividualParticipant(code, name)
    .accounts({
      participant: participantPk,
      subcategory: subcategoryPk,
      authority: signer ? signer.publicKey : program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers(signer ? [signer] : [])
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return participantPk;
}

export async function createTeamParticipant(
  program: Program<ProtocolEvent>,
  subcategoryPk: PublicKey,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const subcategory = await program.account.subcategory.fetch(subcategoryPk);
  const participantPk = findParticipantPda(
    subcategoryPk,
    subcategory.participantCount,
    program as Program,
  );
  await program.methods
    .createTeamParticipant(code, name)
    .accounts({
      participant: participantPk,
      subcategory: subcategoryPk,
      authority: signer ? signer.publicKey : program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers(signer ? [signer] : [])
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return participantPk;
}

export async function createWalletWithBalance(lamportBalance = 1000000000) {
  const payer = Keypair.generate();
  const provider = getAnchorProvider();
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(payer.publicKey, lamportBalance),
  );
  return payer;
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
