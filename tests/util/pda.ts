import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export function findEventPda(code: string, program: Program): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("event"), Buffer.from(code)],
    program.programId,
  );
  return pda;
}

export function findCategoryPda(code: string, program: Program): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("category"), Buffer.from(code)],
    program.programId,
  );
  return pda;
}

export function findEventGroupPda(
  category: PublicKey,
  code: string,
  program: Program,
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("event_group"), category.toBuffer(), Buffer.from(code)],
    program.programId,
  );
  return pda;
}

export function footballCategoryPda(): PublicKey {
  const program: anchor.Program = anchor.workspace.ProtocolEvent;
  return findCategoryPda("FOOTBALL", program);
}

export function eplEventGroupPda(): PublicKey {
  const program: anchor.Program = anchor.workspace.ProtocolEvent;
  return findEventGroupPda(footballCategoryPda(), "EPL", program);
}

export function findParticipantPda(
  category: PublicKey,
  id: number,
  program: Program,
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("participant"),
      category.toBuffer(),
      Buffer.from(id.toString()),
    ],
    program.programId,
  );
  return pda;
}
