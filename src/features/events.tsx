import EventCard from "../components/events/event";
import { useGetEvents } from "../hooks/events";
import moment from "moment";
import { useGetCurrentUserPreregistration } from "../hooks/users";
import { useMemo } from "react";
import { useAuthorizationContext } from "../contexts/authorization-context";
import { eventHasEnded } from "../helpers/events";

const Events = () => {
  const { canPreregister } = useAuthorizationContext();

  const start = moment().startOf("year").format("YYYY-MM-DD");
  const end = moment().endOf("year").format("YYYY-MM-DD");

  const getEvents = useGetEvents(start, end);
  const getPreregistration = useGetCurrentUserPreregistration(() => {});

  const events = useMemo(() => {
    return (
      <>
        {getEvents
          ?.sort((e1, e2) => (eventHasEnded(e1) < eventHasEnded(e2) ? -1 : 1))
          .map((event) => {
            const allowPreregistration =
              canPreregister || getPreregistration.some((e) => e === event.id);
            return (
              <EventCard
                key={event.id}
                event={event}
                allowPreregistration={allowPreregistration}
              />
            );
          })}
      </>
    );
  }, [getEvents, canPreregister, getPreregistration]);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
      {events}
    </div>
  );
};

export default Events;
