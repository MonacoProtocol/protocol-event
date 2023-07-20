import { PublicKey } from "@solana/web3.js";
import {
  closeCategory,
  closeEvent,
  closeEventGroup,
  closeParticipant,
} from "../client";
import { getAnchorProvider, sendTransaction } from "./util";

export async function close() {
  if (process.argv.length < 4) {
    console.log(
      "Usage: yarn run createEventGroup <ACCOUNT_DISCRIMINATOR> <ACCOUNT_PK>",
    );
    process.exit(1);
  }

  const discriminator = process.argv[3];
  const accountPk = new PublicKey(process.argv[4]);

  let ix;
  switch (discriminator) {
    case "event":
      ix = closeEvent({
        event: accountPk,
        authority: getAnchorProvider().publicKey,
        payer: getAnchorProvider().publicKey,
      });
      break;
    case "category":
      ix = closeCategory({
        category: accountPk,
        authority: getAnchorProvider().publicKey,
        payer: getAnchorProvider().publicKey,
      });
      break;
    case "event_group":
      ix = closeEventGroup({
        eventGroup: accountPk,
        authority: getAnchorProvider().publicKey,
        payer: getAnchorProvider().publicKey,
      });
      break;
    case "participant":
      ix = closeParticipant({
        participant: accountPk,
        authority: getAnchorProvider().publicKey,
        payer: getAnchorProvider().publicKey,
      });
      break;
    default:
      console.error(
        "Unknown discriminator, must be one of: event, category, event_group, participant",
      );
  }

  await sendTransaction([ix]);
}
