import { MSRUser } from "./msr-user";

export type EventSettings = {
  stations?: number;
  whitelistedUsers?: MSRUser[];
};
