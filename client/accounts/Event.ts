import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface EventFields {
  authority: PublicKey
  subcategory: PublicKey
  eventGroup: PublicKey
  active: boolean
  payer: PublicKey
  code: string
  name: string
  participants: Array<number>
  expectedStartTimestamp: BN
  actualStartTimestamp: BN | null
  actualEndTimestamp: BN | null
}

export interface EventJSON {
  authority: string
  subcategory: string
  eventGroup: string
  active: boolean
  payer: string
  code: string
  name: string
  participants: Array<number>
  expectedStartTimestamp: string
  actualStartTimestamp: string | null
  actualEndTimestamp: string | null
}

export class Event {
  readonly authority: PublicKey
  readonly subcategory: PublicKey
  readonly eventGroup: PublicKey
  readonly active: boolean
  readonly payer: PublicKey
  readonly code: string
  readonly name: string
  readonly participants: Array<number>
  readonly expectedStartTimestamp: BN
  readonly actualStartTimestamp: BN | null
  readonly actualEndTimestamp: BN | null

  static readonly discriminator = Buffer.from([
    125, 192, 125, 158, 9, 115, 152, 233,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.publicKey("subcategory"),
    borsh.publicKey("eventGroup"),
    borsh.bool("active"),
    borsh.publicKey("payer"),
    borsh.str("code"),
    borsh.str("name"),
    borsh.vec(borsh.u16(), "participants"),
    borsh.i64("expectedStartTimestamp"),
    borsh.option(borsh.i64(), "actualStartTimestamp"),
    borsh.option(borsh.i64(), "actualEndTimestamp"),
  ])

  constructor(fields: EventFields) {
    this.authority = fields.authority
    this.subcategory = fields.subcategory
    this.eventGroup = fields.eventGroup
    this.active = fields.active
    this.payer = fields.payer
    this.code = fields.code
    this.name = fields.name
    this.participants = fields.participants
    this.expectedStartTimestamp = fields.expectedStartTimestamp
    this.actualStartTimestamp = fields.actualStartTimestamp
    this.actualEndTimestamp = fields.actualEndTimestamp
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Event | null> {
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
  ): Promise<Array<Event | null>> {
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

  static decode(data: Buffer): Event {
    if (!data.slice(0, 8).equals(Event.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Event.layout.decode(data.slice(8))

    return new Event({
      authority: dec.authority,
      subcategory: dec.subcategory,
      eventGroup: dec.eventGroup,
      active: dec.active,
      payer: dec.payer,
      code: dec.code,
      name: dec.name,
      participants: dec.participants,
      expectedStartTimestamp: dec.expectedStartTimestamp,
      actualStartTimestamp: dec.actualStartTimestamp,
      actualEndTimestamp: dec.actualEndTimestamp,
    })
  }

  toJSON(): EventJSON {
    return {
      authority: this.authority.toString(),
      subcategory: this.subcategory.toString(),
      eventGroup: this.eventGroup.toString(),
      active: this.active,
      payer: this.payer.toString(),
      code: this.code,
      name: this.name,
      participants: this.participants,
      expectedStartTimestamp: this.expectedStartTimestamp.toString(),
      actualStartTimestamp:
        (this.actualStartTimestamp && this.actualStartTimestamp.toString()) ||
        null,
      actualEndTimestamp:
        (this.actualEndTimestamp && this.actualEndTimestamp.toString()) || null,
    }
  }

  static fromJSON(obj: EventJSON): Event {
    return new Event({
      authority: new PublicKey(obj.authority),
      subcategory: new PublicKey(obj.subcategory),
      eventGroup: new PublicKey(obj.eventGroup),
      active: obj.active,
      payer: new PublicKey(obj.payer),
      code: obj.code,
      name: obj.name,
      participants: obj.participants,
      expectedStartTimestamp: new BN(obj.expectedStartTimestamp),
      actualStartTimestamp:
        (obj.actualStartTimestamp && new BN(obj.actualStartTimestamp)) || null,
      actualEndTimestamp:
        (obj.actualEndTimestamp && new BN(obj.actualEndTimestamp)) || null,
    })
  }
}
