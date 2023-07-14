import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface IndividualJSON {
  kind: "Individual"
}

export class Individual {
  static readonly discriminator = 0
  static readonly kind = "Individual"
  readonly discriminator = 0
  readonly kind = "Individual"

  toJSON(): IndividualJSON {
    return {
      kind: "Individual",
    }
  }

  toEncodable() {
    return {
      Individual: {},
    }
  }
}

export interface TeamJSON {
  kind: "Team"
}

export class Team {
  static readonly discriminator = 1
  static readonly kind = "Team"
  readonly discriminator = 1
  readonly kind = "Team"

  toJSON(): TeamJSON {
    return {
      kind: "Team",
    }
  }

  toEncodable() {
    return {
      Team: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ParticipantTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Individual" in obj) {
    return new Individual()
  }
  if ("Team" in obj) {
    return new Team()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.ParticipantTypeJSON
): types.ParticipantTypeKind {
  switch (obj.kind) {
    case "Individual": {
      return new Individual()
    }
    case "Team": {
      return new Team()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Individual"),
    borsh.struct([], "Team"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
