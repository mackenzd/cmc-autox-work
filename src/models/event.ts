import { Organization } from "./organization";
import { Venue } from "./venue";

export type Event = {
    detailuri: string;
    end: string;
    id: string;
    name: string;
    organization: Organization;
    start: string;
    type: EventType;
    uri: string;
    venue: Venue;
}

export enum EventType {
    'HPDE',
    'Autocross/Solo'
    // TODO: Add the rest of the event types
}