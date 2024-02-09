import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { ComputeBudgetProgram, TransactionInstruction } from "@solana/web3.js";

type TransactionOptions = {
    computeUnitLimit?: number;
    computeUnitPrice?: number;
  };

export async function signAndSendInstructions(
    program: Program,
    instructions: TransactionInstruction[],
    options?: TransactionOptions,
  ): Promise<string>{
    const provider = program.provider as AnchorProvider;

    const transaction = new web3.Transaction()
    instructions.forEach((instruction) => transaction.add(instruction));
    if (options?.computeUnitLimit) {
      transaction.add(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: options.computeUnitLimit,
        }),
      );
    }
    if (options?.computeUnitPrice) {
      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.computeUnitPrice,
        }),
      );
    }
    transaction.feePayer = provider.wallet.publicKey;
    transaction.recentBlockhash = (
      await provider.connection.getLatestBlockhash()
    ).blockhash;
    try {
      const signature = await provider.connection.sendRawTransaction(
        (await provider.wallet.signTransaction(transaction)).serialize(),
      );
      return signature;
    } catch (e) {
      throw new Error(`Error sending transaction: ${JSON.stringify(e)}`);
    }
  }

  export async function confirmTransaction(
    program: Program,
    signature: string,
  ): Promise<boolean>{
    const provider = program.provider as AnchorProvider;
    try {
      const blockHash = await provider.connection.getLatestBlockhash();
      const confirmRequest = {
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
        signature: signature,
      };
      await provider.connection.confirmTransaction(confirmRequest);
    } catch (e) {
      return false;
    }
    return true;
  }
