import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface CreateEventInfoFields {
  code: string
  name: string
  participants: Array<number>
  expectedStartTimestamp: BN
  actualStartTimestamp: BN | null
  actualEndTimestamp: BN | null
}

export interface CreateEventInfoJSON {
  code: string
  name: string
  participants: Array<number>
  expectedStartTimestamp: string
  actualStartTimestamp: string | null
  actualEndTimestamp: string | null
}

export class CreateEventInfo {
  readonly code: string
  readonly name: string
  readonly participants: Array<number>
  readonly expectedStartTimestamp: BN
  readonly actualStartTimestamp: BN | null
  readonly actualEndTimestamp: BN | null

  constructor(fields: CreateEventInfoFields) {
    this.code = fields.code
    this.name = fields.name
    this.participants = fields.participants
    this.expectedStartTimestamp = fields.expectedStartTimestamp
    this.actualStartTimestamp = fields.actualStartTimestamp
    this.actualEndTimestamp = fields.actualEndTimestamp
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.str("code"),
        borsh.str("name"),
        borsh.vec(borsh.u16(), "participants"),
        borsh.i64("expectedStartTimestamp"),
        borsh.option(borsh.i64(), "actualStartTimestamp"),
        borsh.option(borsh.i64(), "actualEndTimestamp"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CreateEventInfo({
      code: obj.code,
      name: obj.name,
      participants: obj.participants,
      expectedStartTimestamp: obj.expectedStartTimestamp,
      actualStartTimestamp: obj.actualStartTimestamp,
      actualEndTimestamp: obj.actualEndTimestamp,
    })
  }

  static toEncodable(fields: CreateEventInfoFields) {
    return {
      code: fields.code,
      name: fields.name,
      participants: fields.participants,
      expectedStartTimestamp: fields.expectedStartTimestamp,
      actualStartTimestamp: fields.actualStartTimestamp,
      actualEndTimestamp: fields.actualEndTimestamp,
    }
  }

  toJSON(): CreateEventInfoJSON {
    return {
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

  static fromJSON(obj: CreateEventInfoJSON): CreateEventInfo {
    return new CreateEventInfo({
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

  toEncodable() {
    return CreateEventInfo.toEncodable(this)
  }
}
