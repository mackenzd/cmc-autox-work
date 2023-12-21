import { MSREvent } from "../models/msr-event";

// Filters out "administrative" MSR events that aren't actual autocross events.
export function filterEvents(events: MSREvent[]): MSREvent[] {
    const cmc = 'Cumberland Motor Club'
    return events.filter((e: MSREvent) => e.organization.name == cmc &&  e.venue.name !== cmc)
}
