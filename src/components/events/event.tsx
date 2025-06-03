import { useMemo, useState } from "react";
import { MSREvent } from "../../models/msr-event";
import WorkAssignmentsModal from "../work-assignments/work-assignment-modal";
import { WorkAssignmentsContextProvider } from "../../contexts/work-assignments-context";
import {
  eventHasEnded,
  eventRegistrationHasStarted,
  eventRegistraionHasEnded,
  eventHasStarted,
  getEventDateObject
} from "../../helpers/events";
import EventSettingsModal from "./event-settings-modal";
import { useAuthorizationContext } from "../../contexts/authorization-context";
import EventResultsModal from "./event-results-modal";

export interface EventCardProps {
  event: MSREvent;
  allowPreregistration: boolean;
}

const EventCard = (props: EventCardProps) => {
  const { isAdmin } = useAuthorizationContext();

  const isSingleDayEvent = useMemo(
    () => props.event.start === props.event.end,
    [props.event.start, props.event.end]
  );

  const startDate = useMemo(
    () => getEventDateObject(props.event?.start),
    [props.event.start]
  );
  const endDate = useMemo(
    () => getEventDateObject(props.event?.end, true),
    [props.event.end]
  );

  const hasStarted = useMemo(() => eventHasStarted(props.event), [props.event]);
  const hasEnded = useMemo(() => eventHasEnded(props.event), [props.event]);
  const hasRegistrationStarted = useMemo(
    () => eventRegistrationHasStarted(props.event),
    [props.event]
  );
  const hasRegistrationEnded = useMemo(
    () => eventRegistraionHasEnded(props.event),
    [props.event]
  );

  const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);
  const [isWorkAssignmentsModalOpen, setIsWorkAssignmentsModalOpen] =
    useState<boolean>(false);

  const resultsModal = useMemo(
    () =>
      isResultsModalOpen ? (
        <EventResultsModal
          event={props.event}
          isOpen={isResultsModalOpen}
          onClose={() => setIsResultsModalOpen(false)}
        />
      ) : (
        <></>
      ),
    [isResultsModalOpen, props.event, setIsResultsModalOpen]
  );

  const settingsModal = useMemo(
    () =>
      isSettingsModalOpen ? (
        <EventSettingsModal
          event={props.event}
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      ) : (
        <></>
      ),
    [isSettingsModalOpen, props.event, setIsSettingsModalOpen]
  );

  const workAssignmentsModal = useMemo(
    () =>
      isWorkAssignmentsModalOpen ? (
        <WorkAssignmentsModal
          isOpen={isWorkAssignmentsModalOpen}
          onClose={() => setIsWorkAssignmentsModalOpen(false)}
        />
      ) : (
        <></>
      ),
    [isWorkAssignmentsModalOpen, setIsWorkAssignmentsModalOpen]
  );

  const modals = useMemo(
    () =>
      isWorkAssignmentsModalOpen ||
      isSettingsModalOpen ||
      isResultsModalOpen ? (
        <WorkAssignmentsContextProvider event={props.event}>
          {resultsModal}
          {settingsModal}
          {workAssignmentsModal}
        </WorkAssignmentsContextProvider>
      ) : (
        <></>
      ),
    [
      isResultsModalOpen,
      resultsModal,
      isWorkAssignmentsModalOpen,
      isSettingsModalOpen,
      settingsModal,
      workAssignmentsModal,
      props.event,
    ]
  );

  const footer = useMemo(() => {
    const eventResultsButton = hasStarted ? (
      <button
        className="btn btn-primary"
        onClick={() => setIsResultsModalOpen(true)}
      >
        Results
      </button>
    ) : (
      <></>
    );

    const eventSettingsButton = isAdmin ? (
      <button
        className="btn btn-primary"
        onClick={() => setIsSettingsModalOpen(true)}
      >
        Settings
      </button>
    ) : (
      <></>
    );

    if (hasEnded) {
      return (
        <div className="flex flex-row gap-2 justify-end">
          <p className="h-12 flex justify-start items-end">
            This event has ended.
          </p>
          {eventResultsButton}
        </div>
      );
    } else if (
      props.event.registered ||
      props.allowPreregistration ||
      isAdmin
    ) {
      return (
        <div className="flex flex-row gap-2 justify-end">
          {eventResultsButton}
          {eventSettingsButton}
          <button
            className="btn btn-primary"
            onClick={() => setIsWorkAssignmentsModalOpen(true)}
          >
            Work Assignments
          </button>
        </div>
      );
    } else {
      let classNames: string;
      let message: string;
      if (hasRegistrationStarted && !hasRegistrationEnded) {
        classNames = "btn btn-primary";
        message = "You are not registered for this event.";
      } else {
        classNames = "btn btn-disabled";
        message = "Registration is not open for this event.";
      }

      return (
        <div className="flex flex-row gap-2 justify-between">
          <p className="self-end">{message}</p>
          <a
            className={classNames}
            href={props.event.detailuri}
            target="_blank"
            rel="noreferrer"
          >
            Register
          </a>
        </div>
      );
    }
  }, [
    props.allowPreregistration,
    hasStarted,
    hasEnded,
    isAdmin,
    props.event.detailuri,
    props.event.registered,
    hasRegistrationStarted,
    hasRegistrationEnded,
  ]);

  return (
    <>
      <div className="card bg-base-100 shadow-xl min-h-52 max-h-72">
        <div className="card-body">
          <a
            className="card-title sm:truncate"
            href={props.event?.detailuri}
            target="_blank"
            rel="noreferrer"
          >
            {props.event?.name}
          </a>
          <p>
            {props.event?.venue.name}
            <br />
            {isSingleDayEvent
              ? startDate.toLocaleDateString()
              : startDate.toLocaleDateString() +
                " - " +
                endDate.toLocaleDateString()}
          </p>
          <div className="h-12">{footer}</div>
        </div>
      </div>
      {modals}
    </>
  );
};

export default EventCard;
