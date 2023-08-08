import * as anchor from "@coral-xyz/anchor";
import {
  createSubcategory,
  createCategory,
  createEventGroup,
} from "../util/test_util";
import assert from "assert";
import { getAnchorProvider } from "../../admin/util";
import { sportCategoryPda } from "../util/pda";

describe("Create Grouping Accounts", () => {
  it("Create Category - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "POLITICS";
    const name = "Politics";
    const categoryPk = await createCategory(program, code, name);

    const category = await program.account.category.fetch(categoryPk);
    assert.equal(code, category.code);
    assert.equal(name, category.name);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      category.payer.toBase58(),
    );
  });

  it("Create Subcategory - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const code = "SC";
    const name = "Code Collecting";
    const subcategoryPk = await createSubcategory(
      program,
      sportCategoryPda(),
      code,
      name,
    );

    const subcategory = await program.account.subcategory.fetch(subcategoryPk);
    assert.equal(code, subcategory.code);
    assert.equal(name, subcategory.name);
    assert.equal(0, subcategory.participantCount);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      subcategory.payer.toBase58(),
    );
  });

  it("Create Event Group - Success", async () => {
    const program = anchor.workspace.ProtocolEvent;

    const subcategoryPk = await createSubcategory(
      program,
      sportCategoryPda(),
      "MUSH",
      "Mushroom Stomping",
    );

    const code = "MUSHUK";
    const name = "Mushroom Stompers Association UK";
    const eventGroupPk = await createEventGroup(
      program,
      subcategoryPk,
      code,
      name,
    );

    const eventGroup = await program.account.eventGroup.fetch(eventGroupPk);
    assert.equal(subcategoryPk.toBase58(), eventGroup.subcategory.toBase58());
    assert.equal(code, eventGroup.code);
    assert.equal(name, eventGroup.name);
    assert.equal(
      getAnchorProvider().publicKey.toBase58(),
      eventGroup.payer.toBase58(),
    );
  });
});
