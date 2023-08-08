import { Connection, PublicKey } from "@solana/web3.js";
import { AccountQuery, Criterion, PublicKeyCriterion } from "./queries";
import { EventGroup } from "../accounts";

export class EventGroups extends AccountQuery<EventGroup> {
  public static eventGroupQuery(connection: Connection) {
    return new EventGroups(connection);
  }

  constructor(connection: Connection) {
    super(connection, EventGroup, new Map<string, Criterion<unknown>>([
        ["authority", new PublicKeyCriterion(8)],
        ["subcategory", new PublicKeyCriterion(8 + 32)],
      ])
    );
  }

  filterByAuthority(authority: PublicKey): EventGroups {
    this.filters.get("authority").setValue(authority);
    return this;
  }

  filterBySubcategory(subcategory: PublicKey): EventGroups {
    this.filters.get("subcategory").setValue(subcategory);
    return this;
  }
}
