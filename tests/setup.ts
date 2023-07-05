import * as anchor from "@coral-xyz/anchor";
import { ProtocolEvent } from "../target/types/protocol_event";
import { createCategory, createEventGroup } from "./util/test_util";

module.exports = async function (_globalConfig, _projectConfig) {
  const program: anchor.Program<ProtocolEvent> = anchor.workspace.ProtocolEvent;
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const categoryPk = await createCategory(program, "FOOTBALL", "Soccer");
  await createEventGroup(program, categoryPk, "EPL", "English Premier League");
};
