import { useEffect, useState } from "react";
import { MSREvent } from "../models/msr-event";
import { getOrganizationEvents, getUserEvents } from "../helpers/events";
import uniqBy from "lodash/uniqBy";
import { MSRAssignment } from "../models/msr-assignment";
import { EventSettings } from "../models/event-settings";

export function useGetOrganizationEvents(
  start?: string,
  end?: string
): MSREvent[] {
  const [organizationEvents, setOrganizationEvents] = useState<MSREvent[]>([]);

  useEffect(() => {
    getOrganizationEvents(start, end).then((events) =>
      setOrganizationEvents(events)
    );
  }, [start, end, setOrganizationEvents]);

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
      const mergedEvents = organizationEvents.map((orgEvent) => {
        const matchingUserEvent = userEvents.find(
          (userEvent) => userEvent.id === orgEvent.id
        );
        if (matchingUserEvent) {
          return { ...orgEvent, registered: matchingUserEvent.registered };
        }
        return orgEvent;
      });

      const combinedEvents = [...userEvents, ...mergedEvents].sort((e1, e2) =>
        new Date(e1.start) > new Date(e2.start) ? 1 : -1
      );

      setEvents(combinedEvents);
    });
  }, [start, end, setEvents]);

  return uniqBy(events, "id");
}

export function useGetEventAssignments(
  onFinish: () => void,
  event?: MSREvent
): MSRAssignment[] {
  const [eventAssignments, setEventAssignments] = useState<MSRAssignment[]>([]);

  useEffect(() => {
    if (event?.id) {
      fetch(`/api/events/${event?.id}/entrylist`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          setEventAssignments(data.response.assignments);
        })
        .catch((error) => console.log(error))
        .finally(() => onFinish());
    }
    // eslint-disable-next-line
  }, [setEventAssignments, event, event?.id]);

  return eventAssignments;
}

export function useGetEventSettings(
  onFinish: () => void,
  event?: MSREvent
): EventSettings {
  const [settings, setSettings] = useState<EventSettings>({});

  useEffect(() => {
    if (event?.id) {
      fetch(`/api/events/${event?.id}/settings`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(res);
        })
        .then((data) => {
          setSettings(data);
        })
        .catch((error) => console.log(error))
        .finally(() => onFinish());
    }
    // eslint-disable-next-line
  }, [event?.id, setSettings]);

  return settings;
}

export function useSetEventSettings(
  onSuccess: () => void,
  event?: MSREvent
): (settings: EventSettings) => void {
  const setEventSettings = (settings: EventSettings) => {
    fetch(`/api/events/${event?.id}/settings`, {
      method: "POST",
      body: JSON.stringify(settings),
    })
      .then((res) => {
        if (res.ok) {
          onSuccess();
        } else {
          return Promise.reject(res);
        }
      })
      .catch((error) => console.log(error));
  };

  return setEventSettings;
}

export function useSetEventResults(
  onSuccess: (filenames: string[]) => void,
  event?: MSREvent
): (files: FileList) => void {
  const setEventResults = async (files: FileList) => {
    let filenames: string[] = [];

    const promises = Array.from(files).map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      filenames.push(file.name);

      return fetch(`/api/events/${event?.id}/results`, {
        method: "POST",
        body: formData,
      });
    });

    try {
      const responses = await Promise.all(promises);

      for (const res of responses) {
        if (!res.ok) {
          if (res.status === 400) {
            const data = await res.json();
            alert(data.error);
            return;
          } else {
            throw res;
          }
        }
      }

      onSuccess(filenames);
    } catch (error) {
      console.error(error);
    }
  };

  return setEventResults;
}

export function useGetEventResults(
  onFinish: (filenames: string[]) => void,
  event?: MSREvent
): string[] {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (event?.id) {
      fetch(`/api/events/${event?.id}/results`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(res);
        })
        .then((data) => {
          setResults(data);
        })
        .catch((error) => console.log(error))
        .finally(() => onFinish(results));
    }
    // eslint-disable-next-line
  }, [event?.id, setResults]);

  return results;
}

export function useGetEventResult(
  event?: MSREvent
): (filename: string) => void {
  const getEventResult = async (filename: string) => {
    if (event?.id) {
      fetch(`/api/events/${event?.id}/results/${filename}`)
        .then((res) => {
          if (res.ok) {
            return res.blob();
          }
          return Promise.reject(res);
        })
        .then((data) => {
          const fileURL = URL.createObjectURL(data);
          const newTab = window.open(fileURL, "_blank");

          if (newTab) {
            newTab.onload = () => {
              URL.revokeObjectURL(fileURL);
            };
          } else {
            URL.revokeObjectURL(fileURL);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return getEventResult;
}

export function useUnsetEventResult(
  onSuccess: (filename: string) => void,
  event?: MSREvent
): (filename: string) => void {
  const unsetEventResult = (filename: string) => {
    fetch(`/api/events/${event?.id}/results/${filename}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          onSuccess(filename);
        } else {
          return Promise.reject(res);
        }
      })
      .catch((error) => console.log(error));
  };

  return unsetEventResult;
}
