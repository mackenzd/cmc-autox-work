import { MSRAssignment } from "../models/msr-assignment";
import { MSREvent } from "../models/msr-event";

// Filters out "administrative" MSR events that aren't actual autocross events.
export function filterEvents(events: MSREvent[]): MSREvent[] {
  const cmc = "Cumberland Motor Club";
  return events.filter(
    (e: MSREvent) => e.organization.name === cmc && e.venue.name !== cmc
  );
}

export function eventHasEnded(event: MSREvent): boolean {
  const endDate = new Date(`${event?.end} UTC`);
  return endDate < new Date();
}

export function getOrganizationEvents(): Promise<MSREvent[]> {
  return fetch("/api/organization/events")
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      return filterEvents(data.response.events);
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
}

export function getUserEvents(): Promise<MSREvent[]> {
  return fetch("/api/user/events")
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      let evts = data.response.events.map((event: MSREvent) => {
        event.registered = true;
        return event;
      });

      return filterEvents(evts);
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
}

export function getEventAssignments(
  eventId: string
): Promise<MSRAssignment[]> {
  return fetch(`/api/events/${eventId}/assignments`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      return data.response.assignments;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
}
