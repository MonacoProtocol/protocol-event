import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

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

export async function findParticipantPda(
  subcategoryPk: PublicKey,
  program: Program,
): Promise<PublicKey> {
  const category = await program.account.category.fetch(subcategoryPk);
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("participant"),
      subcategoryPk.toBuffer(),
      Buffer.from(category.participantCount.toString()),
    ],
    program.programId,
  );
  return pda;
}
