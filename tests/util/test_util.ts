import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Externalevent } from "../../target/types/externalevent";

const { SystemProgram } = anchor.web3;

export async function findEventPda(
  slug: string,
  program: Program,
): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddress(
    [Buffer.from(slug)],
    program.programId,
  );
  return pda;
}

export async function createEventAccount(
  slug: string,
  name: string,
  eventType: object,
  startTime: number,
  participants: string[],
  oracle: string,
  reference: string,
  eventPk: PublicKey,
  program: Program<Externalevent>,
  provider: AnchorProvider,
) {
  await program.methods
    .createEvent(
      slug,
      name,
      eventType,
      new anchor.BN(startTime),
      participants,
      oracle,
      reference,
    )
    .accounts({
      event: eventPk,
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
