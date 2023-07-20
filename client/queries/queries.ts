import { Connection, MemcmpFilter, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { PROGRAM_ID } from "../programId";

export const GET_MULTIPLE_ACCOUNTS_LIMIT = 99;

interface QueryableAccountClass<T> {
  discriminator: Buffer;
  fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
  ): Promise<Array<T | null>>;
  fetch(
    c: Connection,
    address: PublicKey,
  ): Promise<T | null>;
}

export abstract class AccountQuery<T> {
  private readonly connection: Connection;
  private accountClass: QueryableAccountClass<T>;
  protected filters: Map<string, Criterion<unknown>>;

  protected constructor(connection: Connection, accountClass: QueryableAccountClass<T>, filters: Map<string, Criterion<unknown>>) {
    this.connection = connection;
    this.accountClass = accountClass;
    this.filters = filters;
  }

  /**
   *
   * @returns: list of all fetched publicKeys
   */
  public async fetchPublicKeys() {
    try {
      const accounts = await this.connection.getProgramAccounts(
        PROGRAM_ID,
        {
          dataSlice: { offset: 0, length: 0 }, // fetch without any data.
          filters: this.toFilters(...this.filters.values())
        }
      );
      return accounts.map((account) => account.pubkey);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   *
   * @returns fetched accounts mapped to their publicKey
   */
  public async fetch() {
    const publicKeys = await this.fetchPublicKeys();

    let accounts: T[] = [];

    try {
      if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
        accounts = await this.accountClass.fetchMultiple(this.connection, publicKeys);
      } else {
        for (let i = 0; i < publicKeys.length; i += GET_MULTIPLE_ACCOUNTS_LIMIT) {
          const accountsChunk = await this.accountClass.fetchMultiple(this.connection, publicKeys.slice(i, i + GET_MULTIPLE_ACCOUNTS_LIMIT));
          accounts = accounts.concat(accountsChunk);
        }
      }

      return publicKeys
        .map((publicKey, i) => {
          return { publicKey: publicKey, account: accounts[i] };
        })
        .filter((o) => o.account);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  toFilters(
    ...criteria: Criterion<unknown>[]
  ): MemcmpFilter[] {
    const filters: MemcmpFilter[] = [];

    const criteriaSize = criteria
      .map((criterion) => criterion.getSize())
      .reduce((partialSum, a) => partialSum + a, 0);
    const buffer = Buffer.alloc(8 + criteriaSize);

    let filterIndex = 0;
    let filterLength = 0;
    this.accountClass.discriminator.copy(buffer, 0, 0, 8);
    filterLength = filterLength + 8;

    criteria.forEach((criterion) => {
      if (criterion.hasValue()) {
        filterLength += criterion.writeToBuffer(buffer);
      } else {
        if (filterLength > 0) {
          filters.push(this.toFilter(buffer, filterIndex, filterIndex + filterLength));
        }
        filterIndex = filterIndex + filterLength + criterion.getSize();
        filterLength = 0;
      }
    });
    if (filterLength > 0) {
      filters.push(this.toFilter(buffer, filterIndex, filterIndex + filterLength));
    }

    return filters;
  }

  toFilter(
    buffer: Buffer,
    startIndex: number,
    endIndex: number,
  ): MemcmpFilter {
    return {
      memcmp: {
        offset: startIndex,
        bytes: bs58.encode(buffer.subarray(startIndex, endIndex)),
      },
    };
  }
}

export abstract class Criterion<T> {
  private offset: number;
  private size: number;
  private value?: T;

  constructor(offset: number, size: number) {
    this.offset = offset;
    this.size = size;
  }

  getOffset(): number {
    return this.offset;
  }

  getSize(): number {
    return this.size;
  }

  hasValue(): boolean {
    return this.value != undefined;
  }

  getValue(): T | undefined {
    return this.value;
  }

  setValue(value: T) {
    this.value = value;
  }

  abstract writeToBuffer(buffer: Buffer): number;
}

export class BooleanCriterion extends Criterion<boolean> {
  constructor(offset: number) {
    super(offset, 1);
  }

  writeToBuffer(buffer: Buffer): number {
    const bytes = this.toBytes();
    Buffer.from(bytes).copy(buffer, this.getOffset(), 0, bytes.byteLength);
    return bytes.byteLength;
  }

  private toBytes(): Uint8Array {
    const value = this.getValue();
    return value == undefined ? Uint8Array.of() : Uint8Array.of(value ? 1 : 0);
  }
}

export class ByteCriterion extends Criterion<number> {
  constructor(offset: number) {
    super(offset, 1);
  }

  writeToBuffer(buffer: Buffer): number {
    const bytes = this.toBytes();
    Buffer.from(bytes).copy(buffer, this.getOffset(), 0, bytes.byteLength);
    return bytes.byteLength;
  }

  private toBytes(): Uint8Array {
    const value = this.getValue();
    return value == undefined ? Uint8Array.of() : Uint8Array.of(value);
  }
}

export class U16Criterion extends Criterion<number> {
  constructor(offset: number) {
    super(offset, 2);
  }

  writeToBuffer(buffer: Buffer): number {
    const bytes = this.toBytes();
    Buffer.from(bytes).copy(buffer, this.getOffset(), 0, bytes.byteLength);
    return bytes.byteLength;
  }

  private toBytes(): Uint8Array {
    const buffer = Buffer.alloc(2);
    const value = this.getValue();
    if (value != undefined) {
      buffer.writeUInt16LE(value, 0);
    }
    return buffer;
  }
}

export class PublicKeyCriterion extends Criterion<PublicKey> {
  constructor(offset: number) {
    super(offset, 32);
  }

  writeToBuffer(buffer: Buffer): number {
    const bytes = this.toBytes();
    Buffer.from(bytes).copy(buffer, this.getOffset(), 0, bytes.byteLength);
    return bytes.byteLength;
  }

  private toBytes(): Uint8Array {
    const value = this.getValue();
    return value == undefined ? Uint8Array.of() : value.toBytes();
  }
}
