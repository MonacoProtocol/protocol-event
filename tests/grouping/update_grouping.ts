import * as anchor from "@coral-xyz/anchor";
import {
  createCategory,
  createClassification,
  createEventGroup,
} from "../util/test_util";
import assert from "assert";
import { sportClassificationPda } from "../util/pda";

describe("Update Grouping Accounts", () => {
  it("Update classification", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "ESPORTS";
    const name = "Excellent Sports";
    const classificationPk = await createClassification(program, code, name);

    const classification = await program.account.classification.fetch(
      classificationPk,
    );
    assert.equal(code, classification.code);
    assert.equal(name, classification.name);

    const updatedName = "Exceptional Sports";
    await program.methods
      .updateClassificationName(updatedName)
      .accounts({
        classification: classificationPk,
        authority: program.provider.publicKey,
      })
      .rpc();

    const classificiationAfterUpdate =
      await program.account.classification.fetch(classificationPk);
    assert.equal(updatedName, classificiationAfterUpdate.name);
  });

  it("Update category", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "BT";
    const name = "Bean Throwing";
    const categoryPk = await createCategory(
      program,
      sportClassificationPda(),
      code,
      name,
    );

    const category = await program.account.category.fetch(categoryPk);
    assert.equal(code, category.code);
    assert.equal(name, category.name);

    const updatedName = "Bean Throwing UK";
    await program.methods
      .updateCategoryName(updatedName)
      .accounts({
        category: categoryPk,
        authority: program.provider.publicKey,
      })
      .rpc();

    const categoryAfterUpdate = await program.account.category.fetch(
      categoryPk,
    );
    assert.equal(updatedName, categoryAfterUpdate.name);
  });

  it("Update event group", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const categoryPk = await createCategory(
      program,
      sportClassificationPda(),
      "FLCC",
      "Four-Leaf Clover Collecting",
    );

    const code = "PFLCC";
    const name = "Premier Four-Leaf Clover Collecting";
    const eventGroupPk = await createEventGroup(
      program,
      categoryPk,
      code,
      name,
    );

    const eventGroup = await program.account.eventGroup.fetch(eventGroupPk);
    assert.equal(code, eventGroup.code);
    assert.equal(name, eventGroup.name);

    const updatedName = "Four-Leaf Clover and Buttercup Collecting UK";
    await program.methods
      .updateEventGroupName(updatedName)
      .accounts({
        eventGroup: eventGroupPk,
        authority: program.provider.publicKey,
      })
      .rpc();

    const eventGroupAfterUpdate = await program.account.eventGroup.fetch(
      eventGroupPk,
    );
    assert.equal(updatedName, eventGroupAfterUpdate.name);
  });
});
