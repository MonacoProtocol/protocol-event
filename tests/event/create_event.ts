import {describe} from "mocha";

const assert = require("assert");
import * as anchor from '@project-serum/anchor';
import {createEventAccount} from "../util/test_util";

describe("Create Event", () => {

    const provider = anchor.Provider.local();
    anchor.setProvider(provider);

    it("Create Event - Success", async () => {
        const eventProgram = anchor.workspace.Externalevent;

        // keypair for new Event state account
        const eventAccount = anchor.web3.Keypair.generate();
        let {eventName, eventStartTS} = await createEventAccount(eventAccount, eventProgram, provider);

        let createdAccount = await eventProgram.account.externalEvent.fetch(
          eventAccount.publicKey
        );

        assert.equal(createdAccount.name, eventName);
        assert.equal(createdAccount.startExpectedTimestamp.toNumber(), eventStartTS.toNumber());
    });
});
