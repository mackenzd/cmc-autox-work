import EventCard from "../components/events/event";
import { useGetEvents } from "../hooks/events";
import moment from "moment";
import { useGetPreregistration } from "../hooks/users";
import { useMemo } from "react";
import { useAuthorizationContext } from "../contexts/authorization-context";

const Events = () => {
  const { user } = useAuthorizationContext();

  const start = moment().subtract(1, "year").format("YYYY-MM-DD");
  const end = moment().add(1, "year").format("YYYY-MM-DD");

  const getEvents = useGetEvents(start, end);
  const getPreregistration = useGetPreregistration(user);

  const events = useMemo(() => {
    return (
      <>
        {getEvents?.map((event) => {
          const canPreregister = getPreregistration.some((e) => e === event.id);
          return (
            <EventCard
              key={event.id}
              event={event}
              canPreregister={canPreregister}
            />
          );
        })}
      </>
    );
  }, [getEvents, getPreregistration]);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
      {events}
    </div>
  );
};

export default Events;
