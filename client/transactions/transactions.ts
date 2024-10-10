import { ComputeBudgetProgram, Connection, Keypair, TransactionMessage, TransactionInstruction, VersionedTransaction } from "@solana/web3.js";

type TransactionOptions = {
    computeUnitLimit?: number;
    computeUnitPrice?: number;
};

type TransactionOptionsBatch = TransactionOptions & {
  batchSize?: number;
  confirmBatchSuccess?: boolean;
  confirmCommitment?: "confirmed" | "finalized" | "processed";
}

export async function signAndSendInstructions(
    connection: Connection,
    signingKeypair: Keypair,
    instructions: TransactionInstruction[],
    options?: TransactionOptions,
  ): Promise<string>{

    options?.computeUnitLimit ? instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({units: options?.computeUnitLimit})) : null;
    options?.computeUnitPrice ? instructions.unshift(ComputeBudgetProgram.setComputeUnitPrice({microLamports: options?.computeUnitPrice})) : null;

    const message = new TransactionMessage({
      payerKey: signingKeypair.publicKey,
      recentBlockhash: (
        await connection.getLatestBlockhash()
      ).blockhash,
      instructions
    }).compileToV0Message();

    const transaction = new VersionedTransaction( message );
    transaction.sign([signingKeypair]);

    try {
      const signature = await connection.sendTransaction(transaction)
      return signature;
    } catch (e) {
      throw new Error(`Error sending transaction: ${e}`);
    }
  }

export async function signAndSendInstructionsBatch(
    connection: Connection,
    signingKeypair: Keypair,
    instructions: TransactionInstruction[],
    options?: TransactionOptionsBatch,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{signatures: string[], failedInstructions: TransactionInstruction[], errors: any[]}>{
    const signatures = [] as string[];
    const failedInstructions = [] as TransactionInstruction[];
    const DEFAULT_BATCH_SIZE = 2;
    const batchSize = options?.batchSize ? options.batchSize : DEFAULT_BATCH_SIZE;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: any[] = [];

    for (let i = 0; i < instructions.length; i += batchSize) {
      const slicedInstructions = instructions.slice(i, i + batchSize);
      try {
        const tnx = await signAndSendInstructions(
          connection,
          signingKeypair,
          slicedInstructions,
          options,
        );
        signatures.push(tnx);
        if (options?.confirmBatchSuccess){
          const confirmTnx = await confirmTransaction(connection, tnx, options?.confirmCommitment);
          if (!confirmTnx) {
            return {signatures, failedInstructions: slicedInstructions, errors};
          }
        }
      }
      catch (e) {
        errors.push(e);
        failedInstructions.push(...slicedInstructions);
      }
    }
    return {signatures, failedInstructions, errors};
}

export async function confirmTransaction(
    connection: Connection,
    signature: string,
    commitment?: "confirmed" | "finalized" | "processed"
  ): Promise<boolean>{
    try {
      const blockHash = await connection.getLatestBlockhash();
      const confirmRequest = {
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
        signature: signature,
      };
      await connection.confirmTransaction(confirmRequest, commitment || "confirmed");
    } catch (e) {
      return false;
    }
    return true;
  }
