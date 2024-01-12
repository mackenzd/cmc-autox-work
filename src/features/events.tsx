import EventCard from "../components/event";
import { useGetEvents } from "../hooks/events";
import moment from "moment";

const Events = () => {
  const start = moment().subtract(1, 'year').format('YYYY-MM-DD');
  const end = moment().add(1, 'year').format('YYYY-MM-DD');

  const events = useGetEvents(start, end);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
      {events?.map((event) => {
        return <EventCard key={event.id} event={event} />;
      })}
    </div>
  );
};

export default Events;
