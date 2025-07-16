import { MSRUser } from "./msr-user";

export type EventSettings = {
  stations?: number;
  assistants?: number;
  runners?: number;
  preregistrationAccess?: MSRUser[];
};
