import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProtocolEvent } from "../../target/types/protocol_event";
import { CreateEventInfo } from "./constants";
import {
  findCategoryPda,
  findEventGroupPda,
  findEventPda,
  findParticipantPda,
  footballCategoryPda,
} from "./pda";
import { Keypair, PublicKey } from "@solana/web3.js";
import { getAnchorProvider } from "../../admin/util";

const { SystemProgram } = anchor.web3;

export async function createEvent(
  createEventInfo: CreateEventInfo,
  categoryPk: PublicKey,
  eventGroupPk: PublicKey,
  signer?: Keypair,
) {
  const program = anchor.workspace.ProtocolEvent;
  const eventPk = findEventPda(createEventInfo.code, program as Program);
  await program.methods
    .createEvent(createEventInfo)
    .accounts({
      event: eventPk,
      category: categoryPk,
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
      category: footballCategoryPda(),
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
      category: footballCategoryPda(),
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

export async function createEventGroup(
  program: Program<ProtocolEvent>,
  categoryPk: PublicKey,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const eventGroupPk = findEventGroupPda(categoryPk, code, program as Program);
  await program.methods
    .createEventGroup(code, name)
    .accounts({
      eventGroup: eventGroupPk,
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
  return eventGroupPk;
}

export async function createIndividualParticipant(
  program: Program<ProtocolEvent>,
  categoryPk: PublicKey,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const category = await program.account.category.fetch(categoryPk);

  const participantPk = findParticipantPda(
    categoryPk,
    category.participantCount,
    program as Program,
  );
  await program.methods
    .createIndividualParticipant(code, name)
    .accounts({
      participant: participantPk,
      category: categoryPk,
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
  categoryPk: PublicKey,
  code: string,
  name: string,
  signer?: Keypair,
) {
  const category = await program.account.category.fetch(categoryPk);
  const participantPk = findParticipantPda(
    categoryPk,
    category.participantCount,
    program as Program,
  );
  await program.methods
    .createTeamParticipant(code, name)
    .accounts({
      participant: participantPk,
      category: categoryPk,
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
