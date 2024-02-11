import { MSREvent, MSREventType } from "../models/msr-event";

// Filters out "administrative" MSR events that aren't actual autocross events.
export function filterEvents(events: MSREvent[]): MSREvent[] {
  return events.filter(
    (e: MSREvent) =>
      e.organization.name === "Cumberland Motor Club" &&
      e.venue.name !== "Cumberland Motor Club" &&
      e.type === MSREventType.Autocross
  );
}

export function eventHasStarted(event: MSREvent): boolean {
  const startDate = new Date(`${event?.start} UTC`);
  return startDate < new Date();
}

export function eventHasEnded(event: MSREvent): boolean {
  const endDate = new Date(`${event?.end} UTC`);
  return endDate < new Date();
}

export function eventRegistrationHasStarted(event: MSREvent): boolean {
  const startDate = new Date(`${event?.registration?.start} UTC`);
  return startDate < new Date();
}

export function eventRegistraionHasEnded(event: MSREvent): boolean {
  const endDate = new Date(`${event?.registration?.end} UTC`);
  return endDate < new Date();
}

export function getOrganizationEvents(
  start?: string,
  end?: string
): Promise<MSREvent[]> {
  const params: string[] = [];
  if (start) {
    params.push(`start=${encodeURIComponent(start)}`);
  }
  if (end) {
    params.push(`end=${encodeURIComponent(end)}`);
  }

  return fetch(
    `/api/organization/events${params.length > 0 ? `?${params.join("&")}` : ""}`
  )
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
  return fetch("/api/me/events")
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
