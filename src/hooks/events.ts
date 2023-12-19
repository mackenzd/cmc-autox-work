import { useEffect, useState } from "react";
import { Event } from "../models/event";

export function useGetEvents(): Event[] | null {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    fetch("/api/user/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.response.events);
      });
  }, [setEvents]);

  return events;
}
