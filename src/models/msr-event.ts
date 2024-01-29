import { MSROrganization } from "./msr-organization";
import { MSRVenue } from "./msr-venue";

export type MSREvent = {
  detailuri: string;
  end: string;
  id: string;
  name: string;
  organization: MSROrganization;
  start: string;
  type: MSREventType;
  uri: string;
  venue: MSRVenue;
  registered: boolean; // Front end only
};

export enum MSREventType {
  "HPDE",
  "Autocross/Solo",
  // TODO: Add the rest of the event types
}
