import {describe} from "mocha";

const assert = require("assert");
import * as anchor from '@project-serum/anchor';
import {createEventAccount} from "../util/test_util";
import {EventLifeCycleStatus, EventPeriod} from "../util/constants";
import {AnchorError} from "@project-serum/anchor";

const {SystemProgram} = anchor.web3;

describe("Process Update", () => {

    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);

    const eventProgram = anchor.workspace.Externalevent;

    const nameDefault = "TEST NAME";
    const referenceDefault = "TEST REFERENCE";
    const referenceInvalid = "TEST REFERENCE INVALID";
    const participantsDefault = "[\"TEST 1\", \"TEST 2\"]";
    const scoresNilNil = "[0, 0]";
    const scoresDefault = "[1, 2]";
    const periodFirstHalf = "FIRSTHALF";
    const periodFullTime = "FULLTIME";

    it("Update Event Status - Event Update (Period - First Half)", async () => {

        // keypair for new Events` state account
        const eventAccount = anchor.web3.Keypair.generate();
        await createEventAccount(nameDefault, referenceDefault, eventAccount, eventProgram, provider);

        await eventProgram.rpc.processUpdate(
            referenceDefault,
            participantsDefault,
            scoresNilNil,
            periodFirstHalf,
            {
                accounts: {
                    externalEvent: eventAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                }
            }
        )

        let updatedAccount = await eventProgram.account.externalEvent.fetch(
          eventAccount.publicKey
        );

        assert.equal(updatedAccount.reference, referenceDefault);
        assert.equal(updatedAccount.scoreHome, 0);
        assert.equal(updatedAccount.scoreAway, 0);
        assert.deepStrictEqual(updatedAccount.lifecycleStatus, EventLifeCycleStatus.Started);
        assert.deepStrictEqual(updatedAccount.currentPeriod, EventPeriod.FirstHalf);
    });

    it("Update Event Status - Event Update (Period - Full Time)", async () => {

        // keypair for new Events` state account
        const eventAccount = anchor.web3.Keypair.generate();
        await createEventAccount(nameDefault, referenceDefault, eventAccount, eventProgram, provider);

        await eventProgram.rpc.processUpdate(
            referenceDefault,
            participantsDefault,
            scoresNilNil,
            periodFullTime,
            {
                accounts: {
                    externalEvent: eventAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                }
            }
        )

        let updatedAccount = await eventProgram.account.externalEvent.fetch(
          eventAccount.publicKey
        );

        assert.equal(updatedAccount.reference, referenceDefault);
        assert.equal(updatedAccount.scoreHome, 0);
        assert.equal(updatedAccount.scoreAway, 0);
        assert.deepStrictEqual(updatedAccount.lifecycleStatus, EventLifeCycleStatus.Completed);
        assert.deepStrictEqual(updatedAccount.currentPeriod, EventPeriod.FullTime);
    });

    it("Update Event Status - Event Update (Scores)", async () => {

        // keypair for new Events` state account
        const eventAccount = anchor.web3.Keypair.generate();
        await createEventAccount(nameDefault, referenceDefault, eventAccount, eventProgram, provider);

        await eventProgram.rpc.processUpdate(
            referenceDefault,
            participantsDefault,
            scoresDefault,
            periodFirstHalf,
            {
                accounts: {
                    externalEvent: eventAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                }
            }
        )

        let updatedAccount = await eventProgram.account.externalEvent.fetch(
          eventAccount.publicKey
        );

        assert.equal(updatedAccount.reference, referenceDefault);
        assert.equal(updatedAccount.scoreHome, 1);
        assert.equal(updatedAccount.scoreAway, 2);
        assert.deepStrictEqual(updatedAccount.lifecycleStatus, EventLifeCycleStatus.Started);
        assert.deepStrictEqual(updatedAccount.currentPeriod, EventPeriod.FirstHalf);
    });

    it("Update Event Status - Reference not valid", async () => {

        // keypair for new Events` state account
        const eventAccount = anchor.web3.Keypair.generate();
        await createEventAccount(nameDefault, referenceDefault, eventAccount, eventProgram, provider);

        await eventProgram.rpc.processUpdate(
            referenceDefault,
            participantsDefault,
            scoresDefault,
            periodFirstHalf,
            {
                accounts: {
                    externalEvent: eventAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                }
            }
        )

        await (eventProgram.rpc.processUpdate(
            referenceInvalid,
            "[99, 100]",
            scoresDefault,
            periodFullTime,
            {
                accounts: {
                    externalEvent: eventAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                }
            }
        )).then(
             function (_) {
                 assert.ok(false, "This test should have thrown an error");
             },
             function (err: AnchorError) {
                 assert.equal(err.error.errorCode.number,6000);
                 assert.equal(err.error.errorMessage, "Invalid event reference");
             });

        let updatedAccount = await eventProgram.account.externalEvent.fetch(
          eventAccount.publicKey
        );

        // Check account hasn't been modified by rpc with invalid reference
        assert.equal(updatedAccount.scoreHome, 1);
        assert.equal(updatedAccount.scoreAway, 2);
        assert.deepStrictEqual(updatedAccount.lifecycleStatus, EventLifeCycleStatus.Started);
        assert.deepStrictEqual(updatedAccount.currentPeriod, EventPeriod.FirstHalf);
    });

    it("Update Event Status - Event Completed", async () => {

        // keypair for new Events` state account
        const eventAccount = anchor.web3.Keypair.generate();
        await createEventAccount(nameDefault, referenceDefault, eventAccount, eventProgram, provider);

        await eventProgram.rpc.processUpdate(
            referenceDefault,
            participantsDefault,
            scoresDefault,
            periodFullTime,
            {
                accounts: {
                    externalEvent: eventAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                }
            }
        )

        let updatedAccount = await eventProgram.account.externalEvent.fetch(
          eventAccount.publicKey
        );

        assert.equal(updatedAccount.scoreHome, 1);
        assert.equal(updatedAccount.scoreAway, 2);
        assert.deepStrictEqual(updatedAccount.lifecycleStatus, EventLifeCycleStatus.Completed);
        assert.deepStrictEqual(updatedAccount.currentPeriod, EventPeriod.FullTime);
    });

});
