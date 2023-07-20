export type CustomError =
  | MaxStringLengthExceeded
  | MaxParticipantsExceeded
  | InvalidEventParticipants
  | AuthorityMismatch

export class MaxStringLengthExceeded extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "MaxStringLengthExceeded"
  readonly msg = "Max string length exceeded"

  constructor(readonly logs?: string[]) {
    super("6000: Max string length exceeded")
  }
}

export class MaxParticipantsExceeded extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "MaxParticipantsExceeded"
  readonly msg = "Max event participants exceeded"

  constructor(readonly logs?: string[]) {
    super("6001: Max event participants exceeded")
  }
}

export class InvalidEventParticipants extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidEventParticipants"
  readonly msg = "Attempted to add invalid event participants"

  constructor(readonly logs?: string[]) {
    super("6002: Attempted to add invalid event participants")
  }
}

export class AuthorityMismatch extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "AuthorityMismatch"
  readonly msg = "Authority mismatch"

  constructor(readonly logs?: string[]) {
    super("6003: Authority mismatch")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new MaxStringLengthExceeded(logs)
    case 6001:
      return new MaxParticipantsExceeded(logs)
    case 6002:
      return new InvalidEventParticipants(logs)
    case 6003:
      return new AuthorityMismatch(logs)
  }

  return null
}
