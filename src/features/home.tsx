import EventCard from "../components/event";
import { useGetEvents } from "../hooks/events";

const Home = () => {
  const events = useGetEvents();

  return (
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
        {events?.map((event) => {
          return <EventCard event={event} />;
        })}
      </div>
    </>
  );
};

export default Home;
