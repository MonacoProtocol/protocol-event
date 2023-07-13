import * as anchor from "@coral-xyz/anchor";
import { createCategory, createEventGroup } from "../util/test_util";
import assert from "assert";

describe("Update Grouping Accounts", () => {
  it("Update category", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "BT";
    const name = "Bean Throwing";
    const categoryPk = await createCategory(program, code, name);

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
