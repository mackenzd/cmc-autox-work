import { MSRUser } from "./msr-user";

export type EventSettings = {
  stations?: number;
  assistants?: number;
  preregistrationAccess?: MSRUser[];
};
