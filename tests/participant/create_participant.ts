import {
  createSubcategory,
  createIndividualParticipant,
  createTeamParticipant,
  createWalletWithBalance,
} from "../util/test_util";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  findParticipantPda,
  footballSubcategoryPda,
  sportCategoryPda,
} from "../util/pda";
import assert from "assert";
import { getAnchorProvider } from "../../admin/util";
import { SystemProgram } from "@solana/web3.js";

describe("Create Participants", () => {
  it("Create Individual Participant - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "EWANM";
    const name = "Ewan Mcgregor";
    const individualPk = await createIndividualParticipant(
      program,
      footballSubcategoryPda(),
      code,
      name,
    );

    const individual = await program.account.participant.fetch(individualPk);
    assert.equal(
      footballSubcategoryPda().toBase58(),
      individual.subcategory.toBase58(),
    );
    assert.deepEqual({ individual: {} }, individual.participantType);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      individual.payer.toBase58(),
    );
    assert.equal(code, individual.code);
    assert.equal(name, individual.name);
    assert.equal(true, individual.active);
  });

  it("Create Team Participant - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "EWNUTD";
    const name = "Ewan United";
    const teamPk = await createTeamParticipant(
      program,
      footballSubcategoryPda(),
      code,
      name,
    );

    const team = await program.account.participant.fetch(teamPk);
    assert.equal(
      footballSubcategoryPda().toBase58(),
      team.subcategory.toBase58(),
    );
    assert.deepEqual({ team: {} }, team.participantType);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      team.payer.toBase58(),
    );
    assert.equal(code, team.code);
    assert.equal(name, team.name);
    assert.equal(true, team.active);
  });

  it("Create Multiple Participants - Category participant count and id increments", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const subcategoryPk = await createSubcategory(
      program,
      sportCategoryPda(),
      "SPORT",
      "Sportsball 99",
    );

    const code = "EWANM";
    const participant1Pk = await createIndividualParticipant(
      program,
      subcategoryPk,
      code,
      "Ewan Mcgregor",
    );

    const participant = await program.account.participant.fetch(participant1Pk);
    assert.equal(1, participant.id);
    assert.equal(code, participant.code);

    const code2 = "EWANM2";
    const participant2Pk = await createIndividualParticipant(
      program,
      subcategoryPk,
      code2,
      "Ewan Mcgregor II",
    );

    const participant2 = await program.account.participant.fetch(
      participant2Pk,
    );
    assert.equal(2, participant2.id);
    assert.equal(code2, participant2.code);

    const code3 = "EWANM3";
    const participant3Pk = await createTeamParticipant(
      program,
      subcategoryPk,
      code3,
      "Ewan Mcgregor's Team",
    );

    const participant3 = await program.account.participant.fetch(
      participant3Pk,
    );
    assert.equal(3, participant3.id);
    assert.equal(code3, participant3.code);

    const subcategory = await program.account.subcategory.fetch(subcategoryPk);
    assert.equal(3, subcategory.participantCount);
  });

  it("Create Participant - Category authority does not match", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const subcategoryPk = await createSubcategory(
      program,
      sportCategoryPda(),
      "CAUTH",
      "CategoryDefaultAuth",
    );
    const subcategory = await program.account.subcategory.fetch(subcategoryPk);
    const participantPk = findParticipantPda(
      subcategoryPk,
      subcategory.participantCount,
      program as Program,
    );

    const incorrectAuthority = await createWalletWithBalance();

    await program.methods
      .createIndividualParticipant(Date.now().toString(), "Tester")
      .accounts({
        participant: participantPk,
        subcategory: subcategoryPk,
        authority: incorrectAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([incorrectAuthority])
      .rpc()
      .then(
        function (_) {
          assert.fail("Expected AuthorityMismatch error");
        },
        function (err: anchor.AnchorError) {
          assert.equal(err.error.errorCode.code, "AuthorityMismatch");
        },
      );
  });
});
