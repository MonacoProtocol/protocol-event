import { getAnchorProvider } from "./util";
import * as anchor from "@coral-xyz/anchor";
import {
  activateEvent,
  addEventParticipants,
  createEvent,
  deactivateEvent,
} from "./event";
import { createCategory } from "./category";
import { createEventGroup } from "./eventGroup";
import { createParticipant } from "./participant";
import { close } from "./closeAccount";
import { createSubcategory } from "./subcategory";

if (process.argv.length < 3) {
  printUsageAndExit();
}

const provider = getAnchorProvider();
anchor.setProvider(provider);

const script = process.argv[2];

switch (script) {
  case "createEvent":
    createEvent();
    break;
  case "createCategory":
    createCategory();
    break;
  case "createSubcategory":
    createSubcategory();
    break;
  case "createEventGroup":
    createEventGroup();
    break;
  case "createParticipant":
    createParticipant();
    break;
  case "addEventParticipants":
    addEventParticipants();
    break;
  case "removeEventParticipants":
    addEventParticipants();
    break;
  case "close":
    close();
    break;
  case "activateEvent":
    activateEvent();
    break;
  case "deactivateEvent":
    deactivateEvent();
    break;
  default:
    printUsageAndExit();
    break;
}

function printUsageAndExit() {
  console.log("Usage: yarn ts-node <command> <args> ...");
  process.exit(1);
}
