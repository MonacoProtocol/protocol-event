import { BN } from "@coral-xyz/anchor";

export type CreateEventInfo = {
  code: string;
  name: string;
  participants: number[];
  expectedStartTimestamp: BN;
  actualStartTimestamp: BN | null;
  actualEndTimestamp: BN | null;
};
