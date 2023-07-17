import { Connection, PublicKey } from "@solana/web3.js";
import { AccountQuery, BooleanCriterion, Criterion, PublicKeyCriterion } from "./queries";
import { Event } from "../accounts";

export class Events extends AccountQuery<Event> {
  public static eventQuery(connection: Connection) {
    return new Events(connection);
  }

  constructor(connection: Connection) {

    super(connection, Event, new Map<string, Criterion<unknown>>([
        ["authority", new PublicKeyCriterion(8)],
        ["category", new PublicKeyCriterion(8 + 32)],
        ["eventGroup", new PublicKeyCriterion(8 + 32 + 32)],
        ["active", new BooleanCriterion(8 + 32 + 32 + 32)]
      ])
    );
  }

  filterByAuthority(authority: PublicKey): Events {
    this.filters.get("authority").setValue(authority);
    return this;
  }

  filterByCategory(category: PublicKey): Events {
    this.filters.get("category").setValue(category);
    return this;
  }

  filterByEventGroup(eventGroup: PublicKey): Events {
    this.filters.get("eventGroup").setValue(eventGroup);
    return this;
  }

  filterByActive(active: boolean): Events {
    this.filters.get("active").setValue(active);
    return this;
  }
}
