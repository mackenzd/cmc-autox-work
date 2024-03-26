import WorkAssignmentsOther from "./work-assignment-other";
import WorkAssignmentsStation from "./work-assignment-station";
import { RunGroup } from "../../models/run-group";
import { useWorkAssignmentsContext } from "../../contexts/work-assignments-context";
import { MSRSegment } from "../../models/msr-segment";
import { useMemo } from "react";
import { useAuthorizationContext } from "../../contexts/authorization-context";
import { getRegistrations, getWorksheet } from "../../helpers/work-assignments";
import { closeDropdownOnClick } from "../../helpers/utils";

export interface WorkAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkAssignmentsModal = (props: WorkAssignmentsModalProps) => {
  const {
    event,
    availableSegments,
    segment,
    setSegment,
    runGroup,
    setRunGroup,
    settings,
    isLoading,
  } = useWorkAssignmentsContext();
  const { isAdmin } = useAuthorizationContext();

  const segmentSelector = useMemo(() => {
    const isSingleDayEvent = event?.start === event?.end;

    return (
      <>
        <select
          className="select select-primary select-xs max-w-xs"
          disabled={isSingleDayEvent || isLoading}
          key={segment}
          value={segment}
          onChange={(e) => {
            setSegment(e.target.value as MSRSegment);
          }}
        >
          {Object.values(availableSegments).map((sg) => (
            <option key={sg} value={sg}>
              {sg}
            </option>
          ))}
        </select>
        {isSingleDayEvent ? (
          <></>
        ) : (
          <div className="label">
            <span className="label-text-alt">
              Choose the day for your work assignment request.
            </span>
          </div>
        )}
      </>
    );
  }, [
    isLoading,
    availableSegments,
    segment,
    setSegment,
    event?.start,
    event?.end,
  ]);

  const runGroupSelector = useMemo(() => {
    return (
      <select
        className="select select-primary select-xs max-w-xs"
        disabled={isLoading}
        key={runGroup}
        value={runGroup}
        onChange={(e) => {
          setRunGroup(e.target.value as RunGroup);
        }}
      >
        {Object.values(RunGroup).map((rg) => (
          <option key={rg} value={rg}>
            {rg}
          </option>
        ))}
      </select>
    );
  }, [isLoading, runGroup, setRunGroup]);

  const workAssignmentStations = useMemo(() => {
    const stations = [];
    for (let i = 1; i <= settings.stations!; i++) {
      stations.push(
        <WorkAssignmentsStation key={`station-${i}`} station={i} />
      );
    }

    return stations;
  }, [settings.stations]);

  const modalContent = useMemo(() => {
    return isLoading ? (
      <div className="skeleton h-60 md:h-96 my-2"></div>
    ) : (
      <div className="overflow-y-auto my-2">
        <WorkAssignmentsOther />
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg-xl:grid-cols-4 gap-2">
          {workAssignmentStations}
        </div>
      </div>
    );
  }, [isLoading, workAssignmentStations]);

  const modalActions = useMemo(() => {
    return (
      <div className="modal-action mt-0">
        {isAdmin && !isLoading ? (
          <div className="dropdown dropdown-top dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline btn-sm m-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-printer"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
              </svg>{" "}
              Print
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48 outline outline-1"
            >
              <li>
                <button
                  onClick={() =>
                    closeDropdownOnClick(() => {
                      getRegistrations(event, segment);
                    })
                  }
                >
                  Registration List
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    closeDropdownOnClick(() => {
                      getWorksheet(event, segment, runGroup);
                    })
                  }
                >
                  Work Assignments
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
        <button
          className="btn btn-outline btn-sm self-center"
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    );
    // eslint-disable-next-line
  }, [event, isAdmin, isLoading, runGroup, segment]);

  const modalHeader = useMemo(() => {
    return (
      <div>
        <div className="font-bold text-lg">Work Assignment Request</div>
        <div className="font-bold text-sm">{event?.name}</div>
      </div>
    );
  }, [event?.name]);

  return props.isOpen ? (
    <dialog className="modal" open={props.isOpen}>
      <div className="modal-box border border-current sm:max-h-[80vh] md:max-h-[90vh] lg-xl:max-h-screen work-assignments-content">
        <div className="gap-2 work-assignments-header">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={props.onClose}
          >
            ✕
          </button>
          {modalHeader}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg-xl:grid-cols-4 pb-2">
            <label className="form-control">
              <div className="label">
                <span className="font-bold label-text">Day</span>
              </div>
              {segmentSelector}
            </label>
            <label className="form-control lg-xl:col-span-3">
              <div className="label">
                <span className="font-bold label-text">Run Group</span>
              </div>
              {runGroupSelector}
              {/* <div className="label">
                <span className="label-text-alt">
                  Your default run group is determined by your car number.
                </span>
              </div> */}
            </label>
          </div>
        </div>
        {modalContent}
        {modalActions}
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default WorkAssignmentsModal;
