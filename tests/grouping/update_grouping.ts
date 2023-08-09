import * as anchor from "@coral-xyz/anchor";
import {
  createSubcategory,
  createCategory,
  createEventGroup,
} from "../util/test_util";
import assert from "assert";
import { sportCategoryPda } from "../util/pda";

describe("Update Grouping Accounts", () => {
  it("Update category", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "ESPORTS";
    const name = "Excellent Sports";
    const categoryPk = await createCategory(program, code, name);

    const category = await program.account.category.fetch(categoryPk);
    assert.equal(code, category.code);
    assert.equal(name, category.name);

    const updatedName = "Exceptional Sports";
    await program.methods
      .updateCategoryName(updatedName)
      .accounts({
        category: categoryPk,
        authority: program.provider.publicKey,
      })
      .rpc();

    const classificiationAfterUpdate = await program.account.category.fetch(
      categoryPk,
    );
    assert.equal(updatedName, classificiationAfterUpdate.name);
  });

  it("Update category", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "BT";
    const name = "Bean Throwing";
    const subcategoryPk = await createSubcategory(
      program,
      sportCategoryPda(),
      code,
      name,
    );

    const subcategory = await program.account.subcategory.fetch(subcategoryPk);
    assert.equal(code, subcategory.code);
    assert.equal(name, subcategory.name);

    const updatedName = "Bean Throwing UK";
    await program.methods
      .updateSubcategoryName(updatedName)
      .accounts({
        subcategory: subcategoryPk,
        authority: program.provider.publicKey,
      })
      .rpc();

    const categoryAfterUpdate = await program.account.subcategory.fetch(
      subcategoryPk,
    );
    assert.equal(updatedName, categoryAfterUpdate.name);
  });

  it("Update event group", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const subcategoryPk = await createSubcategory(
      program,
      sportCategoryPda(),
      "FLCC",
      "Four-Leaf Clover Collecting",
    );

    const code = "PFLCC";
    const name = "Premier Four-Leaf Clover Collecting";
    const eventGroupPk = await createEventGroup(
      program,
      subcategoryPk,
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
