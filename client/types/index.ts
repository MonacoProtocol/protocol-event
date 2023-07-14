import * as ParticipantType from "./ParticipantType"

export { CreateEventInfo } from "./CreateEventInfo"
export type {
  CreateEventInfoFields,
  CreateEventInfoJSON,
} from "./CreateEventInfo"
export { ParticipantType }

export type ParticipantTypeKind =
  | ParticipantType.Individual
  | ParticipantType.Team
export type ParticipantTypeJSON =
  | ParticipantType.IndividualJSON
  | ParticipantType.TeamJSON
