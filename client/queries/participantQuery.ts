import { Connection, PublicKey } from "@solana/web3.js";
import { AccountQuery, BooleanCriterion, ByteCriterion, Criterion, PublicKeyCriterion } from "./queries";
import { Participant } from "../accounts";
import { ParticipantTypeKind } from "../types";

export class Participants extends AccountQuery<Participant> {
  public static participantQuery(connection: Connection) {
    return new Participants(connection);
  }

  constructor(connection: Connection) {
    super(connection, Participant, new Map<string, Criterion<unknown>>([
        ["authority", new PublicKeyCriterion(8)],
        ["category", new PublicKeyCriterion(8 + 32)],
        ["participantType", new ByteCriterion(8 + 32 + 32)],
        ["active", new BooleanCriterion(8 + 32 + 32 + 1)]
      ])
    );
  }

  filterByAuthority(authority: PublicKey): Participants {
    this.filters.get("authority").setValue(authority);
    return this;
  }

  filterByCategory(category: PublicKey): Participants {
    this.filters.get("category").setValue(category);
    return this;
  }

  filterByParticipantType(participantType: ParticipantTypeKind): Participants {
    this.filters.get("participantType").setValue(participantType.discriminator);
    return this;
  }

  filterByActive(active: boolean): Participants {
    this.filters.get("active").setValue(active);
    return this;
  }
}
