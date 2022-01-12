import * as anchor from "@project-serum/anchor";

const {SystemProgram} = anchor.web3;

export async function generateMarketPoolPda(marketAccount: PublicKey, program: PublicKey, betDirection: string, competitor: string) {
    let [pda, _] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(betDirection), marketAccount.toBuffer(), Buffer.from(competitor)],
        program.programId
    );

    return pda;
}

export async function createEventAccount(eventAccount: Keypair, eventProgram, provider: Provider) {

    let eventName = "TEST EVENT NAME";
    let eventStartTS = new anchor.BN(1924200000);
    let homeTeamName = "Home Team";
    let awayTeamName = "Away Team";

    await eventProgram.rpc.createEvent(
        eventName,
        eventStartTS,
        homeTeamName,
        awayTeamName,
        {
            accounts: {
                event: eventAccount.publicKey,
                authority: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [eventAccount]
        });

    return {eventName, eventStartTS};
}
