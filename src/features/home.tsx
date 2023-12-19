import { useGetEvents } from "../hooks/events";

const Home = () => {
  const events = useGetEvents();

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
      {events?.map((event) => {
        const isSingleDayEvent = event.start == event.end;

        return (
            <div key={event?.id} className="card lg:card-side bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{event?.name}</h2>
                <p>
                  {isSingleDayEvent
                    ? event?.start
                    : event?.start + " - " + event?.end}
                </p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" disabled>
                    Results
                  </button>
                  <button className="btn btn-primary">Work Assignments</button>
                </div>
              </div>
            </div>
        );
      })}
    </div>
  );
};

export default Home;
