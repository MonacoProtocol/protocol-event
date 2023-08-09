import * as anchor from "@coral-xyz/anchor";
import { ProtocolEvent } from "../target/types/protocol_event";
import {
  createSubcategory,
  createCategory,
  createEventGroup,
  createIndividualParticipant,
} from "./util/test_util";

module.exports = async function (_globalConfig, _projectConfig) {
  const program: anchor.Program<ProtocolEvent> = anchor.workspace.ProtocolEvent;
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  // create some default grouping accounts
  const categoryPk = await createCategory(program, "SPORT", "Sport");
  const subcategoryPk = await createSubcategory(
    program,
    categoryPk,
    "FOOTBALL",
    "Soccer",
  );
  await createEventGroup(
    program,
    subcategoryPk,
    "EPL",
    "English Premier League",
  );

  // initialize some participants for subcategory
  for (let i = 0; i < 10; i++) {
    await createIndividualParticipant(
      program,
      subcategoryPk,
      `P${i}`,
      `Player ${i}`,
    );
  }
};
