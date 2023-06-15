import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ProtocolEvent } from "../../target/types/protocol_event";
import { CreateEventInfo } from "./constants";

const { SystemProgram } = anchor.web3;

export function findEventPda(slug: string, program: Program): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from(slug)],
    program.programId,
  );
  return pda;
}

export async function createEventAccount(
  createEventInfo: CreateEventInfo,
  program: Program<ProtocolEvent>,
) {
  const eventPk = findEventPda(createEventInfo.slug, program as Program);
  await program.methods
    .createEvent(createEventInfo)
    .accounts({
      event: eventPk,
      authority: program.provider.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
