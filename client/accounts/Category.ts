import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CategoryFields {
  authority: PublicKey
  code: string
  name: string
  participantCount: number
  payer: PublicKey
}

export interface CategoryJSON {
  authority: string
  code: string
  name: string
  participantCount: number
  payer: string
}

export class Category {
  readonly authority: PublicKey
  readonly code: string
  readonly name: string
  readonly participantCount: number
  readonly payer: PublicKey

  static readonly discriminator = Buffer.from([
    242, 35, 245, 232, 221, 227, 98, 52,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.str("code"),
    borsh.str("name"),
    borsh.u16("participantCount"),
    borsh.publicKey("payer"),
  ])

  constructor(fields: CategoryFields) {
    this.authority = fields.authority
    this.code = fields.code
    this.name = fields.name
    this.participantCount = fields.participantCount
    this.payer = fields.payer
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Category | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<Category | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): Category {
    if (!data.slice(0, 8).equals(Category.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Category.layout.decode(data.slice(8))

    return new Category({
      authority: dec.authority,
      code: dec.code,
      name: dec.name,
      participantCount: dec.participantCount,
      payer: dec.payer,
    })
  }

  toJSON(): CategoryJSON {
    return {
      authority: this.authority.toString(),
      code: this.code,
      name: this.name,
      participantCount: this.participantCount,
      payer: this.payer.toString(),
    }
  }

  static fromJSON(obj: CategoryJSON): Category {
    return new Category({
      authority: new PublicKey(obj.authority),
      code: obj.code,
      name: obj.name,
      participantCount: obj.participantCount,
      payer: new PublicKey(obj.payer),
    })
  }
}
