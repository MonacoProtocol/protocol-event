import * as anchor from "@project-serum/anchor";
import {  PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { Externalevent } from "../../target/types/externalevent";

const { SystemProgram } = anchor.web3;

export async function findEventPda(name: String, startTime: number, program: Program): Promise<PublicKey> {
    let [pda] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(name), Buffer.from(startTime.toString())],
        program.programId
    );
    return pda;
}

export async function createEventAccount(
        eventName,
        eventStartTime,
        eventParticipants: string[],
        eventOracle: string,
        eventReference: string,
        eventPk: PublicKey,
        eventProgram: Program<Externalevent>,
        provider: AnchorProvider
    ) {

    await eventProgram.methods.createEvent(
        eventName,
        new anchor.BN(eventStartTime),
        eventParticipants,
        eventOracle,
        eventReference).accounts(
            {
                event: eventPk,
                authority: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            }
        )
        .rpc()
        .catch((e) => {
            console.error(e);
            throw e;
        });
    return {eventName};
}
