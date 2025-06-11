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

export function getEventDateObject(dateString: string = '1970-01-01', eod: boolean = false): Date {
  // Event dates are in the format "YYYY-MM-DD"
  const edtTimezoneOffset = '-04:00';
  const timeString = eod ? 'T23:59:59.999' : 'T00:00:00.000';
  return new Date(`${dateString}${timeString}${edtTimezoneOffset}`);
}

export function getEventRegistrationDateObject(dateString: string = '1970-01-01 00:00'): Date {
  // Registration dates are in the format "YYYY-MM-DD HH:mm" with UTC times
  return new Date(`${dateString.replace(' ', 'T')}:00Z`);
}

export function eventHasStarted(event: MSREvent): boolean {
  return getEventDateObject(event?.start) < new Date();
}

export function eventHasEnded(event: MSREvent): boolean {
  return getEventDateObject(event?.end, true) < new Date();
}

export function eventRegistrationHasStarted(event: MSREvent): boolean {
  return getEventRegistrationDateObject(event?.registration?.start) < new Date();
}

export function eventRegistraionHasEnded(event: MSREvent): boolean {
  return getEventRegistrationDateObject(event?.registration?.end) < new Date();
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
