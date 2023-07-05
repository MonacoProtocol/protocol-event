import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProtocolEvent } from "../../target/types/protocol_event";
import { CreateEventInfo } from "./constants";
import { findCategoryPda, findEventGroupPda, findEventPda } from "./pda";
import { PublicKey } from "@solana/web3.js";

const { SystemProgram } = anchor.web3;

export async function createEventAccount(
  createEventInfo: CreateEventInfo,
  categoryPk: PublicKey,
  eventGroupPk: PublicKey,
  program: Program<ProtocolEvent>,
) {
  const eventPk = findEventPda(createEventInfo.slug, program as Program);
  await program.methods
    .createEvent(createEventInfo)
    .accounts({
      event: eventPk,
      category: categoryPk,
      eventGroup: eventGroupPk,
      authority: program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return eventPk;
}

export async function createCategory(
  program: Program<ProtocolEvent>,
  code: string,
  name: string,
) {
  const categoryPk = findCategoryPda(code, program as Program);
  await program.methods
    .createCategory(code, name)
    .accounts({
      category: categoryPk,
      payer: program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
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
) {
  const eventGroupPk = findEventGroupPda(categoryPk, code, program as Program);
  await program.methods
    .createEventGroup(code, name)
    .accounts({
      eventGroup: eventGroupPk,
      category: categoryPk,
      payer: program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
  return eventGroupPk;
}
