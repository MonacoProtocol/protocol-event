import { Connection, PublicKey } from "@solana/web3.js";
import { AccountQuery, Criterion, PublicKeyCriterion } from "./queries";
import { Category } from "../accounts";

export class Categories extends AccountQuery<Category> {
  public static categoryQuery(connection: Connection) {
    return new Categories(connection);
  }

  constructor(connection: Connection) {
    super(connection, Category, new Map<string, Criterion<unknown>>([
        ["authority", new PublicKeyCriterion(8)],
      ])
    );
  }

  filterByAuthority(authority: PublicKey): Categories {
    this.filters.get("authority").setValue(authority);
    return this;
  }
}
