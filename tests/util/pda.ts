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

export function findSubcategoryPda(
  category: PublicKey,
  code: string,
  program: Program,
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("subcategory"), category.toBuffer(), Buffer.from(code)],
    program.programId,
  );
  return pda;
}

export function findEventGroupPda(
  subcategory: PublicKey,
  code: string,
  program: Program,
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("event_group"), subcategory.toBuffer(), Buffer.from(code)],
    program.programId,
  );
  return pda;
}

export function sportCategoryPda(): PublicKey {
  const program: anchor.Program = anchor.workspace.ProtocolEvent;
  return findCategoryPda("SPORT", program);
}

export function footballSubcategoryPda(): PublicKey {
  const program: anchor.Program = anchor.workspace.ProtocolEvent;
  return findSubcategoryPda(sportCategoryPda(), "FOOTBALL", program);
}

export function eplEventGroupPda(): PublicKey {
  const program: anchor.Program = anchor.workspace.ProtocolEvent;
  return findEventGroupPda(footballSubcategoryPda(), "EPL", program);
}

export function findParticipantPda(
  subcategory: PublicKey,
  id: number,
  program: Program,
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("participant"),
      subcategory.toBuffer(),
      Buffer.from(id.toString()),
    ],
    program.programId,
  );
  return pda;
}
