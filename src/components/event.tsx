import { useMemo, useState } from "react";
import { MSREvent } from "../models/msr-event";
import WorkAssignmentsModal from "./work-assignments";
import { RunGroup } from "../models/run-group";

export interface EventCardProps {
  event: MSREvent;
}

const EventCard = (props: EventCardProps) => {
  const isSingleDayEvent = props.event.start == props.event.end;
  const isRegistered = props.event.registered;

  const startDate = new Date(`${props.event?.start} EST`);
  const endDate = new Date(`${props.event?.end} EST`);
  const hasEnded = endDate < new Date();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const theModal = useMemo(()=>(<WorkAssignmentsModal
    event={props.event}
    runGroup={RunGroup.Even} // TODO: Get default run group
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
  />), [isModalOpen, props.event, setIsModalOpen]);

  return (
    <>
      <div key={props.event?.id} className="card lg:card-side bg-base-100 shadow-xl">
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
                {isRegistered ? (
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
      {theModal}
    </>
  );
};

export default EventCard;
