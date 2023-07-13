import * as anchor from "@coral-xyz/anchor";
import { createCategory, createEventGroup } from "../util/test_util";
import assert from "assert";
import { getAnchorProvider } from "../../admin/util";

describe("Create Grouping Accounts", () => {
  it("Create Category - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "SC";
    const name = "Code Collecting";
    const categoryPk = await createCategory(program, code, name);

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
