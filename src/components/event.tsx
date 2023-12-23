import { useMemo, useState } from "react";
import { MSREvent } from "../models/msr-event";
import WorkAssignmentsModal from "./work-assignments/work-assignment-modal";
import { RunGroup } from "../models/run-group";
import { WorkAssignmentsContextProvider } from "./work-assignments/work-assignments-context";

export interface EventCardProps {
  event: MSREvent;
}

const EventCard = (props: EventCardProps) => {
  const isSingleDayEvent = useMemo(
    () => props.event.start == props.event.end,
    [props.event.start, props.event.end]
  );

  const startDate = useMemo(
    () => new Date(`${props.event?.start} EST`),
    [props.event.start]
  );
  const endDate = useMemo(
    () => new Date(`${props.event?.end} EST`),
    [props.event.end]
  );
  const hasEnded = useMemo(() => endDate < new Date(), [endDate]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const workAssignmentModal = useMemo(
    () => (
      <WorkAssignmentsContextProvider
        event={props.event}
      >
        <WorkAssignmentsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </WorkAssignmentsContextProvider>
    ),
    [isModalOpen, props.event, setIsModalOpen]
  );

  return (
    <>
      <div
        key={props.event?.id}
        className="card lg:card-side bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <div className="event-header">
            <h2 className="card-title">{props.event?.name}</h2>
          </div>
          <p>
            {props.event?.venue.name}
            <br />
            {isSingleDayEvent
              ? startDate.toLocaleDateString()
              : startDate.toLocaleDateString() +
                " - " +
                endDate.toLocaleDateString()}
          </p>
          <div className="card-actions justify-end event-footer">
            {hasEnded ? (
              <p>This event has ended.</p>
            ) : (
              <>
                {props.event.registered ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Work Assignments
                  </button>
                ) : (
                  <>
                    <p>You are not registered for this event.</p>
                    <a
                      className="btn btn-primary"
                      href={props.event?.detailuri}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Register
                    </a>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {workAssignmentModal}
    </>
  );
};

export default EventCard;
