import { useEffect, useState } from "react";
import { MSREvent } from "../models/msr-event";
import { filterEvents } from "../helpers/events";

export function useGetOrganizationEvents(): MSREvent[] | null {
  const [organizationEvents, setOrganizationEvents] = useState<MSREvent[] | null>(
    null
  );

  useEffect(() => {
    fetch("/api/organization/events")
      .then((res) => res.json())
      .then((data) => {
        setOrganizationEvents(filterEvents(data.response.events));
      });
  }, [setOrganizationEvents]);

  return organizationEvents;
}

export function useGetUserEvents(): MSREvent[] | null {
  const [userEvents, setUserEvents] = useState<MSREvent[] | null>(null);

  useEffect(() => {
    fetch("/api/user/events")
      .then((res) => res.json())
      .then((data) => {
        let evts = data.response.events.map((event: MSREvent) => {
          event.registered = true;
          return event
        });

        setUserEvents(filterEvents(evts));
      });
  }, [setUserEvents]);

  return userEvents;
}

export function useGetEvents(): MSREvent[] | null {
  const userEvents = useGetUserEvents();
  const organizationEvents = useGetOrganizationEvents();

  const events = [...userEvents??[], ...organizationEvents??[]].sort((e1, e2) => new Date(e1.start) > new Date(e2.start) ? -1 : 1)
  // const events = userEvents?.sort((e1, e2) => new Date(e1.start) > new Date(e2.start) ? -1 : 1)

  return events;
}
