import * as anchor from "@coral-xyz/anchor";
import {
  createCategory,
  createClassification,
  createEventGroup,
} from "../util/test_util";
import assert from "assert";
import { getAnchorProvider } from "../../admin/util";
import { sportClassificationPda } from "../util/pda";

describe("Create Grouping Accounts", () => {
  it("Create Classification - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "POLITICS";
    const name = "Politics";
    const classificationPk = await createClassification(program, code, name);

    const classification = await program.account.classification.fetch(
      classificationPk,
    );
    assert.equal(code, classification.code);
    assert.equal(name, classification.name);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      classification.payer.toBase58(),
    );
  });

  it("Create Category - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "SC";
    const name = "Code Collecting";
    const categoryPk = await createCategory(
      program,
      sportClassificationPda(),
      code,
      name,
    );

    const category = await program.account.category.fetch(categoryPk);
    assert.equal(code, category.code);
    assert.equal(name, category.name);
    assert.equal(0, category.participantCount);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      category.payer.toBase58(),
    );
  });

  it("Create Event Group - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const categoryPk = await createCategory(
      program,
      sportClassificationPda(),
      "MUSH",
      "Mushroom Stomping",
    );

    const code = "MUSHUK";
    const name = "Mushroom Stompers Association UK";
    const eventGroupPk = await createEventGroup(
      program,
      categoryPk,
      code,
      name,
    );

    const eventGroup = await program.account.eventGroup.fetch(eventGroupPk);
    assert.equal(categoryPk.toBase58(), eventGroup.category.toBase58());
    assert.equal(code, eventGroup.code);
    assert.equal(name, eventGroup.name);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      eventGroup.payer.toBase58(),
    );
  });
});
