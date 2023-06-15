import { BN } from "@coral-xyz/anchor";

// TODO port these to monaco client
export type CreateEventInfo = {
  category: Category;
  eventGroup: EventGroup;
  slug: string;
  name: string;
  participants: number[];
  expectedStartTimestamp: BN;
  actualStartTimestamp: BN | null;
  actualEndTimestamp: BN | null;
};

export type Category = {
  id: string;
  name: string;
};

export type EventGroup = {
  id: string;
  name: string;
};

export type Participant = {
  id: string;
  name: string;
};
