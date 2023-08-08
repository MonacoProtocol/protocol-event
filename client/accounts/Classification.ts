import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClassificationFields {
  authority: PublicKey
  code: string
  name: string
  payer: PublicKey
}

export interface ClassificationJSON {
  authority: string
  code: string
  name: string
  payer: string
}

export class Classification {
  readonly authority: PublicKey
  readonly code: string
  readonly name: string
  readonly payer: PublicKey

  static readonly discriminator = Buffer.from([
    229, 1, 103, 182, 216, 191, 58, 250,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.str("code"),
    borsh.str("name"),
    borsh.publicKey("payer"),
  ])

  constructor(fields: ClassificationFields) {
    this.authority = fields.authority
    this.code = fields.code
    this.name = fields.name
    this.payer = fields.payer
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Classification | null> {
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
  ): Promise<Array<Classification | null>> {
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

  static decode(data: Buffer): Classification {
    if (!data.slice(0, 8).equals(Classification.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Classification.layout.decode(data.slice(8))

    return new Classification({
      authority: dec.authority,
      code: dec.code,
      name: dec.name,
      payer: dec.payer,
    })
  }

  toJSON(): ClassificationJSON {
    return {
      authority: this.authority.toString(),
      code: this.code,
      name: this.name,
      payer: this.payer.toString(),
    }
  }

  static fromJSON(obj: ClassificationJSON): Classification {
    return new Classification({
      authority: new PublicKey(obj.authority),
      code: obj.code,
      name: obj.name,
      payer: new PublicKey(obj.payer),
    })
  }
}
