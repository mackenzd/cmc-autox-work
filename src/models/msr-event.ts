import { MSROrganization } from "./msr-organization";
import { MSRVenue } from "./msr-venue";

export type MSREvent = {
  cancelled: boolean;
  description: string;
  detailuri: string;
  end: string;
  id: string;
  image: MSREventImage;
  name: string;
  organization: MSROrganization;
  public: boolean;
  registration: MSREventRegistration;
  start: string;
  type: MSREventType;
  uri: string;
  venue: MSRVenue;
  registered: boolean; // Frontend only
};

export enum MSREventType {
  HDPE = "HPDE",
  Autocross = "Autocross/Solo",
}

export type MSREventImage = {
  standard: string;
};

export type MSREventRegistration = {
  end: string;
  start: string;
};
