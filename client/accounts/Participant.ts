import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ParticipantFields {
  authority: PublicKey
  category: PublicKey
  participantType: types.ParticipantTypeKind
  active: boolean
  name: string
  code: string
  id: number
  payer: PublicKey
}

export interface ParticipantJSON {
  authority: string
  category: string
  participantType: types.ParticipantTypeJSON
  active: boolean
  name: string
  code: string
  id: number
  payer: string
}

export class Participant {
  readonly authority: PublicKey
  readonly category: PublicKey
  readonly participantType: types.ParticipantTypeKind
  readonly active: boolean
  readonly name: string
  readonly code: string
  readonly id: number
  readonly payer: PublicKey

  static readonly discriminator = Buffer.from([
    32, 142, 108, 79, 247, 179, 54, 6,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.publicKey("category"),
    types.ParticipantType.layout("participantType"),
    borsh.bool("active"),
    borsh.str("name"),
    borsh.str("code"),
    borsh.u16("id"),
    borsh.publicKey("payer"),
  ])

  constructor(fields: ParticipantFields) {
    this.authority = fields.authority
    this.category = fields.category
    this.participantType = fields.participantType
    this.active = fields.active
    this.name = fields.name
    this.code = fields.code
    this.id = fields.id
    this.payer = fields.payer
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Participant | null> {
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
  ): Promise<Array<Participant | null>> {
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

  static decode(data: Buffer): Participant {
    if (!data.slice(0, 8).equals(Participant.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Participant.layout.decode(data.slice(8))

    return new Participant({
      authority: dec.authority,
      category: dec.category,
      participantType: types.ParticipantType.fromDecoded(dec.participantType),
      active: dec.active,
      name: dec.name,
      code: dec.code,
      id: dec.id,
      payer: dec.payer,
    })
  }

  toJSON(): ParticipantJSON {
    return {
      authority: this.authority.toString(),
      category: this.category.toString(),
      participantType: this.participantType.toJSON(),
      active: this.active,
      name: this.name,
      code: this.code,
      id: this.id,
      payer: this.payer.toString(),
    }
  }

  static fromJSON(obj: ParticipantJSON): Participant {
    return new Participant({
      authority: new PublicKey(obj.authority),
      category: new PublicKey(obj.category),
      participantType: types.ParticipantType.fromJSON(obj.participantType),
      active: obj.active,
      name: obj.name,
      code: obj.code,
      id: obj.id,
      payer: new PublicKey(obj.payer),
    })
  }
}
