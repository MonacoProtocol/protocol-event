import { PublicKey } from "@solana/web3.js";

export function findCategoryPda(code: string, programId: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("category"), Buffer.from(code)],
      programId,
    );
    return pda;
  }

export function findSubcategoryPda(
    category: PublicKey,
    code: string,
    programId: PublicKey,
  ): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("subcategory"), category.toBuffer(), Buffer.from(code)],
      programId,
    );
    return pda;
}

export function findEventGroupPda(
    subcategoryPk: PublicKey,
    code: string,
    programId: PublicKey,
  ): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_group"), subcategoryPk.toBuffer(), Buffer.from(code)],
      programId,
    );
    return pda;
}

export function findEventPda(code: string, programId: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), Buffer.from(code)],
      programId,
    );
    return pda;
}

export function findParticipantPda(
    subcategoryPk: PublicKey,
    categoryParticipantCount: number,
    programId: PublicKey,
  ): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("participant"),
        subcategoryPk.toBuffer(),
        Buffer.from(categoryParticipantCount.toString()),
      ],
      programId,
    );
    return pda;
}

export function findAssociatedPdasForSubcategory(
  categoryCode: string,
  subcategoryCode: string,
  programId: PublicKey,
){
  const categoryPda = findCategoryPda(categoryCode, programId);
  const subcategoryPda = findSubcategoryPda(categoryPda, subcategoryCode, programId);
  return {categoryPda, subcategoryPda};
}

export function findAssociatedPdasForEventGroup(
  categoryCode: string,
  subcategoryCode: string,
  eventGroupCode: string,
  programId: PublicKey,
){
  const {categoryPda, subcategoryPda} = findAssociatedPdasForSubcategory(categoryCode, subcategoryCode, programId);
  const eventGroupPda = findEventGroupPda(subcategoryPda, eventGroupCode, programId);
  return {categoryPda, subcategoryPda, eventGroupPda};
};
