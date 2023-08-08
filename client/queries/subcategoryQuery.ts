import { Connection, PublicKey } from "@solana/web3.js";
import { AccountQuery, Criterion, PublicKeyCriterion } from "./queries";
import { Subcategory } from "../accounts";

export class Subcategories extends AccountQuery<Subcategory> {
  public static subcategoryQuery(connection: Connection) {
    return new Subcategories(connection);
  }

  constructor(connection: Connection) {
    super(connection, Subcategory, new Map<string, Criterion<unknown>>([
        ["authority", new PublicKeyCriterion(8)],
      ])
    );
  }

  filterByAuthority(authority: PublicKey): Subcategories {
    this.filters.get("authority").setValue(authority);
    return this;
  }
}
