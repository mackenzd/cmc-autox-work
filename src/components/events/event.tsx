import { useMemo, useState } from "react";
import { MSREvent } from "../../models/msr-event";
import WorkAssignmentsModal from "../work-assignments/work-assignment-modal";
import { WorkAssignmentsContextProvider } from "../../contexts/work-assignments-context";
import {
  eventHasEnded,
  eventRegistrationHasStarted,
  eventRegistraionHasEnded,
  eventHasStarted,
  getEventDateObject,
  TimeOfDay
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
    () => getEventDateObject(props.event?.end, TimeOfDay.EOD),
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

  const eventSettingsButton = isAdmin ? (
    <button
      className="btn btn-sm btn-circle btn-link justify-end"
      onClick={() => setIsSettingsModalOpen(true)}
    >
      <svg
        fill="none"
        height="18"
        viewBox="0 0 24 24"
        width="18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m13.5 2 .4961-.06202c-.0312-.25021-.2439-.43798-.4961-.43798zm-3 0v-.5c-.2522 0-.4649.18777-.4961.43798zm3.2747 2.19754-.4961.06201c.0261.20894.1803.37912.3856.42564zm2.487 1.03084-.2667.42292c.1781.11232.4074.10103.5737-.02824zm1.7487-1.36012.3536-.35355c-.1783-.17831-.4615-.19594-.6606-.04112zm2.1213 2.12132.3947.30697c.1548-.19904.1372-.48221-.0411-.66052zm-1.3601 1.74873-.3947-.30697c-.1292.1662-.1405.39559-.0282.57369zm1.0309 2.48699-.4877.1105c.0465.2053.2167.3595.4256.3856zm2.1975.2747h.5c0-.2522-.1878-.4649-.438-.4961zm0 3 .062.4961c.2502-.0312.438-.2439.438-.4961zm-2.1975.2747-.0621-.4961c-.2089.0261-.3791.1803-.4256.3856zm-1.0309 2.487-.4229-.2667c-.1123.1781-.101.4075.0282.5737zm1.3601 1.7487.3536.3536c.1783-.1783.1959-.4615.0411-.6606zm-2.1213 2.1213-.307.3947c.1991.1548.4823.1372.6606-.0411zm-1.7487-1.3601.307-.3947c-.1663-.1292-.3956-.1405-.5737-.0282zm-2.487 1.0309-.1105-.4877c-.2053.0465-.3595.2167-.3856.4256zm-.2747 2.1975v.5c.2522 0 .4649-.1878.4961-.438zm-3 0-.4961.062c.0312.2502.2439.438.4961.438zm-.2747-2.1975.4961-.0621c-.0261-.2089-.1803-.3791-.3856-.4256zm-2.48698-1.0309.26672-.4229c-.1781-.1123-.40748-.101-.57369.0282zm-1.74873 1.3601-.35355.3536c.17831.1783.46148.1959.66052.0411zm-2.12132-2.1213-.39467-.307c-.15482.1991-.13719.4823.04112.6606zm1.36012-1.7487.39468.307c.12927-.1662.14056-.3956.02824-.5737zm-1.03085-2.487.48765-.1105c-.04652-.2053-.2167-.3595-.42564-.3856zm-2.19754-.2747h-.5c0 .2522.18777.4649.43798.4961zm0-3-.06202-.4961c-.25021.0312-.43798.2439-.43798.4961zm2.19754-.2747.06201.4961c.20894-.0261.37912-.1803.42564-.3856zm1.03085-2.48699.42292.26672c.11232-.1781.10103-.40748-.02824-.57369zm-1.36012-1.74872-.35355-.35356c-.17831.17831-.19594.46148-.04113.66053zm2.12132-2.12132.30697-.39468c-.19904-.15481-.48222-.13718-.66052.04112zm1.74873 1.36012-.30697.39467c.1662.12927.39559.14057.57369.02824zm2.48698-1.03085.1105.48765c.2053-.04652.3595-.2167.3856-.42564zm3.2747-2.69754h-3v1h3zm.7708 2.63552-.2747-2.19754-.9922.12404.2747 2.19753zm2.2576.66995c-.8005-.50488-1.6915-.88002-2.6433-1.09558l-.2209.9753c.8388.18998 1.6244.52064 2.3308.96611zm.0403.81759 1.7487-1.36012-.614-.78935-1.7487 1.36012zm1.0882-1.40124 2.1213 2.12132.7071-.70711-2.1213-2.12132zm2.0802 1.46079-1.3602 1.74873.7894.61394 1.3601-1.74873zm.553 4.43229c-.2155-.95177-.5907-1.84277-1.0956-2.64332l-.8458.53345c.4455.70635.7761 1.49192.9661 2.33077zm1.7719-.111-2.1975-.27473-.1241.99223 2.1976.2747zm.438 3.4961v-3h-1v3zm-2.6355.7708 2.1975-.2747-.124-.9922-2.1976.2747zm-.67 2.2576c.5049-.8005.8801-1.6915 1.0956-2.6433l-.9753-.2209c-.19.8388-.5206 1.6244-.9661 2.3308zm1.3319 1.175-1.3601-1.7487-.7894.614 1.3602 1.7487zm-2.1624 2.7819 2.1213-2.1213-.7071-.7071-2.1213 2.1213zm-2.4093-1.319 1.7487 1.3601.614-.7893-1.7487-1.3602zm-2.0696 1.1238c.9518-.2155 1.8428-.5907 2.6433-1.0956l-.5334-.8458c-.7064.4455-1.492.7761-2.3308.9661zm.111 1.7719.2747-2.1975-.9922-.1241-.2747 2.1976zm-3.4961.438h3v-1h-3zm-.77083-2.6355.27473 2.1975.9922-.124-.2747-2.1976zm-2.25757-.67c.80054.5049 1.69154.8801 2.6433 1.0956l.2209-.9753c-.83884-.19-1.62441-.5206-2.33076-.9661zm-1.17504 1.3319 1.74873-1.3601-.61394-.7894-1.74873 1.3602zm-2.78184-2.1624 2.12132 2.1213.70711-.7071-2.12132-2.1213zm1.319-2.4093-1.36012 1.7487.78935.614 1.36012-1.7487zm-1.12383-2.0696c.21556.9518.5907 1.8428 1.09558 2.6433l.84584-.5334c-.44547-.7064-.77614-1.492-.96612-2.3308zm-1.77191.111 2.19754.2747.12403-.9922-2.19753-.2747zm-.43798-3.4961v3h1v-3zm2.63552-.77083-2.19754.27473.12404.9922 2.19753-.2747zm.66995-2.25758c-.50488.80054-.88002 1.69154-1.09558 2.64331l.9753.2209c.18998-.83884.52064-1.62442.96612-2.33077zm-1.33188-1.17503 1.36012 1.74872.78936-.61394-1.36012-1.74872zm2.16245-2.78185-2.12132 2.12132.7071.70711 2.12132-2.12132zm2.40925 1.319-1.74873-1.36012-.61394.78935 1.74873 1.36012zm2.06961-1.12382c-.95177.21556-1.84276.5907-2.6433 1.09558l.53344.84583c.70635-.44547 1.49192-.77613 2.33076-.96611zm-.111-1.77191-.27473 2.19754.99223.12403.2747-2.19753z"
          fill="oklch(var(--bc)/1)"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="oklch(var(--bc)/1)"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ) : (
    <></>
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
        <div className="card-body p-4">
          <div className="flex flex-row justify-between">
            <a
              className="card-title sm:truncate"
              href={props.event?.detailuri}
              target="_blank"
              rel="noreferrer"
            >
              {props.event?.name}
            </a>
            {eventSettingsButton}
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
          <div className="h-12">{footer}</div>
        </div>
      </div>
      {modals}
    </>
  );
};

export default EventCard;
