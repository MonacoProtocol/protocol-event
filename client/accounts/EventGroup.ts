import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface EventGroupFields {
  authority: PublicKey
  category: PublicKey
  code: string
  name: string
  payer: PublicKey
}

export interface EventGroupJSON {
  authority: string
  category: string
  code: string
  name: string
  payer: string
}

export class EventGroup {
  readonly authority: PublicKey
  readonly category: PublicKey
  readonly code: string
  readonly name: string
  readonly payer: PublicKey

  static readonly discriminator = Buffer.from([
    106, 141, 50, 250, 195, 28, 208, 131,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.publicKey("category"),
    borsh.str("code"),
    borsh.str("name"),
    borsh.publicKey("payer"),
  ])

  constructor(fields: EventGroupFields) {
    this.authority = fields.authority
    this.category = fields.category
    this.code = fields.code
    this.name = fields.name
    this.payer = fields.payer
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<EventGroup | null> {
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
  ): Promise<Array<EventGroup | null>> {
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

  static decode(data: Buffer): EventGroup {
    if (!data.slice(0, 8).equals(EventGroup.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = EventGroup.layout.decode(data.slice(8))

    return new EventGroup({
      authority: dec.authority,
      category: dec.category,
      code: dec.code,
      name: dec.name,
      payer: dec.payer,
    })
  }

  toJSON(): EventGroupJSON {
    return {
      authority: this.authority.toString(),
      category: this.category.toString(),
      code: this.code,
      name: this.name,
      payer: this.payer.toString(),
    }
  }

  static fromJSON(obj: EventGroupJSON): EventGroup {
    return new EventGroup({
      authority: new PublicKey(obj.authority),
      category: new PublicKey(obj.category),
      code: obj.code,
      name: obj.name,
      payer: new PublicKey(obj.payer),
    })
  }
}
