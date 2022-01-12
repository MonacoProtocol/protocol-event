import {describe} from "mocha";

const assert = require("assert");
import * as anchor from '@project-serum/anchor';
import {createEventAccount} from "../util/test_util";
import {EventLifeCycleStatus} from "../util/constants";

const {SystemProgram} = anchor.web3;

describe("Process Event", () => {

    const provider = anchor.Provider.local();
    anchor.setProvider(provider);

    it("Update Event Status - Event Start", async () => {

        const eventProgram = anchor.workspace.Event;

        // keypair for new Events` state account
        const eventAccount = anchor.web3.Keypair.generate();
        await createEventAccount(eventAccount, eventProgram, provider);

        await eventProgram.rpc.processEventStarted(
            {
                accounts: {
                    event: eventAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                }
            }
        )

        let updatedAccount = await eventProgram.account.event.fetch(
          eventAccount.publicKey
        );

        assert.deepStrictEqual(updatedAccount.lifecycleStatus, EventLifeCycleStatus.Started);
    });

});
