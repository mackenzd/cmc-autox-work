import { MSREvent } from "../models/msr-event";

// Filters out "administrative" MSR events that aren't actual autocross events.
export function filterEvents(events: MSREvent[]): MSREvent[] {
    const cmc = 'Cumberland Motor Club'
    return events.filter((e: MSREvent) => e.organization.name == cmc &&  e.venue.name !== cmc)
}

export function getOrganizationEvents(): Promise<MSREvent[]> {
    return fetch("/api/organization/events")
      .then((res) => res.json())
      .then((data) => {
        return filterEvents(data.response.events);
      });
}

export function getUserEvents(): Promise<MSREvent[]> {
    return fetch("/api/user/events")
      .then((res) => res.json())
      .then((data) => {
        let evts = data.response.events.map((event: MSREvent) => {
          event.registered = true;
          return event
        });

        return filterEvents(evts);
      });
}