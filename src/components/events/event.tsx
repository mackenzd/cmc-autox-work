import { useMemo, useState } from "react";
import { MSREvent } from "../../models/msr-event";
import WorkAssignmentsModal from "../work-assignments/work-assignment-modal";
import { WorkAssignmentsContextProvider } from "../work-assignments/work-assignments-context";
import { eventHasEnded } from "../../helpers/events";
import EventSettingsModal from "./event-settings-modal";
import { useAuthorizationContext } from "../../authorization-context";

export interface EventCardProps {
  event: MSREvent;
}

const EventCard = (props: EventCardProps) => {
  const isSingleDayEvent = useMemo(
    () => props.event.start === props.event.end,
    [props.event.start, props.event.end]
  );

  const startDate = useMemo(
    () => new Date(`${props.event?.start} UTC`),
    [props.event.start]
  );
  const endDate = useMemo(
    () => new Date(`${props.event?.end} UTC`),
    [props.event.end]
  );

  const hasEnded = useMemo(() => eventHasEnded(props.event), [props.event]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);
  const [isWorkAssignmentModalOpen, setIsWorkAssignmentModalOpen] =
    useState<boolean>(false);

  const settingsModal = useMemo(
    () => isSettingsModalOpen && (
      <EventSettingsModal
        event={props.event}
        isOpen={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
        }}
      />
    ),
    [isSettingsModalOpen, props.event, setIsSettingsModalOpen]
  );

  const workAssignmentModal = useMemo(
    () => isWorkAssignmentModalOpen &&  (
      <WorkAssignmentsModal
        isOpen={isWorkAssignmentModalOpen}
        onClose={() => setIsWorkAssignmentModalOpen(false)}
      />
    ),
    [isWorkAssignmentModalOpen, props.event, setIsWorkAssignmentModalOpen]
  );

  const modals = useMemo(
    () => (isWorkAssignmentModalOpen || isSettingsModalOpen) &&  (
      <WorkAssignmentsContextProvider event={props.event}>
        {settingsModal}
        {workAssignmentModal}
      </WorkAssignmentsContextProvider>
    ),
    [isWorkAssignmentModalOpen, isSettingsModalOpen, settingsModal, workAssignmentModal, props.event]
  );

  const { isAdmin } = useAuthorizationContext();
  const eventSettingsButton =
    isAdmin && !hasEnded ? (
      <button
        className="btn btn-primary"
        onClick={() => setIsSettingsModalOpen(true)}
      >
        Event Settings
      </button>
    ) : (
      <></>
    );

  const workAssignmentsButton = hasEnded ? (
    <p>This event has ended.</p>
  ) : (
    <>
      {props.event.registered ? (
        <button
          className="btn btn-primary"
          onClick={() => setIsWorkAssignmentModalOpen(true)}
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
  );

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{props.event?.name}</h2>
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
            {eventSettingsButton}
            {workAssignmentsButton}
          </div>
        </div>
      </div>
      {modals}
    </>
  );
};

export default EventCard;
