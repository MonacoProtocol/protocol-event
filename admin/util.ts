import { PublicKey } from "@solana/web3.js";
import process from "process";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

const PROGRAM_TYPE = {
  stable: new PublicKey("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf"),
  dev: new PublicKey("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf"),
};

export async function getProgram() {
  const provider = getAnchorProvider();
  const program = process.env.PROGRAM_TYPE;

  if (program == undefined) {
    console.log("Please ensure PROGRAM_TYPE variable is set <stable|dev>");
    process.exit(1);
    return;
  }

  const programId = PROGRAM_TYPE[program.toLowerCase()];
  if (programId == undefined) {
    console.log(`Program id not found for PROGRAM_TYPE ${program}`);
    process.exit(1);
    return;
  }

  return Program.at(programId, provider);
}

export function getAnchorProvider(): AnchorProvider {
  return AnchorProvider.env();
}

export async function findEventPda(
  code: string,
  program: Program,
): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddress(
    [Buffer.from(code)],
    program.programId,
  );
  return pda;
}
