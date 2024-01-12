import { useEffect, useState } from "react";
import { MSREvent } from "../models/msr-event";
import {
  eventHasEnded,
  getEventAssignments,
  getOrganizationEvents,
  getUserEvents,
} from "../helpers/events";
import uniqBy from "lodash/uniqBy";
import { MSRAssignment } from "../models/msr-assignment";

export function useGetOrganizationEvents(start?: string, end?: string): MSREvent[] {
  const [organizationEvents, setOrganizationEvents] = useState<MSREvent[]>([]);

  useEffect(() => {
    getOrganizationEvents(start, end).then((events) => setOrganizationEvents(events));
  }, [setOrganizationEvents]);

  return organizationEvents;
}

export function useGetUserEvents(): MSREvent[] {
  const [userEvents, setUserEvents] = useState<MSREvent[]>([]);

  useEffect(() => {
    getUserEvents().then((events) => setUserEvents(events));
  }, [setUserEvents]);

  return userEvents;
}

export function useGetEvents(start?: string, end?: string): MSREvent[] {
  const [events, setEvents] = useState<MSREvent[]>([]);

  useEffect(() => {
    const p1 = getUserEvents();
    const p2 = getOrganizationEvents(start, end);

    Promise.all([p1, p2]).then(([userEvents, organizationEvents]) => {
      const events = [
        ...(userEvents ?? []),
        ...(organizationEvents ?? []),
      ].sort((e1, e2) => (new Date(e1.start) > new Date(e2.start) ? -1 : 1));
      setEvents(events);
    });
  }, [setEvents]);

  return uniqBy(events, "id");
}

export function useGetEventAssignments(event: MSREvent): MSRAssignment[] {
  const [eventAssignments, setEventAssignments] = useState<MSRAssignment[]>([]);

  useEffect(() => {
    if (event.id && !eventHasEnded(event)) {
      getEventAssignments(event.id).then((assignments) =>
        setEventAssignments(assignments)
      );
    }
  }, [setEventAssignments, event, event.id]);

  return eventAssignments;
}
