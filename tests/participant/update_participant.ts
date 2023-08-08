import * as anchor from "@coral-xyz/anchor";
import { createIndividualParticipant } from "../util/test_util";
import { footballSubcategoryPda } from "../util/pda";
import assert from "assert";

describe("Update Participants", () => {
  it("Update participant - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "EWANM";
    const name = "Ewan Mcgregor";
    const participantPk = await createIndividualParticipant(
      program,
      footballSubcategoryPda(),
      code,
      name,
    );

    const participant = await program.account.participant.fetch(participantPk);
    assert.equal(code, participant.code);
    assert.equal(name, participant.name);

    const updatedName = "Mcgregor Ewan";
    await program.methods
      .updateParticipantName(updatedName)
      .accounts({
        participant: participantPk,
        authority: program.provider.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });

    const participantNameUpdate = await program.account.participant.fetch(
      participantPk,
    );
    assert.equal(updatedName, participantNameUpdate.name);

    const updatedCode = "MNAWE";
    await program.methods
      .updateParticipantCode(updatedCode)
      .accounts({
        participant: participantPk,
        authority: program.provider.publicKey,
      })
      .rpc()
      .catch((e) => {
        console.error(e);
        throw e;
      });

    const participantCodeUpdate = await program.account.participant.fetch(
      participantPk,
    );
    assert.equal(updatedCode, participantCodeUpdate.code);
  });
});
