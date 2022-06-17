import * as anchor from "@project-serum/anchor";
import {Keypair, PublicKey} from "@solana/web3.js";
import {AnchorProvider, Provider} from "@project-serum/anchor";

const {SystemProgram} = anchor.web3;

export async function generateMarketPoolPda(marketAccount: PublicKey, program: PublicKey, betDirection: string, competitor: string) {
    let [pda, _] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(betDirection), marketAccount.toBuffer(), Buffer.from(competitor)],
        program
    );

    return pda;
}

export async function createEventAccount(
        eventName,
        eventReference: String,
        eventAccount: Keypair,
        eventProgram,
        provider: AnchorProvider
    ) {

    let eventStartTS = new anchor.BN(1924200000);
    let homeTeamName = "Home Team";
    let awayTeamName = "Away Team";

    await eventProgram.rpc.createExternalEvent(
        eventName,
        eventReference,
        eventStartTS,
        homeTeamName,
        awayTeamName,
        {
            accounts: {
                externalEvent: eventAccount.publicKey,
                authority: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [eventAccount]
        });

    return {eventName, eventStartTS};
}
