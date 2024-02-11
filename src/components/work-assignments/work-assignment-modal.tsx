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
    return (
      <select
        className="select select-primary select-xs max-w-xs"
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
    );
  }, [availableSegments, segment, setSegment]);

  const runGroupSelector = useMemo(() => {
    return (
      <select
        className="select select-primary select-xs max-w-xs"
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
  }, [runGroup, setRunGroup]);

  const workAssignmentStations = useMemo(() => {
    const stations = [];
    for (let i = 1; i <= settings.stations!; i++) {
      stations.push(
        <WorkAssignmentsStation key={`station-${i}`} station={i} />
      );
    }

    return stations;
  }, [settings.stations]);

  const modalContent = useMemo(
    () =>
      isLoading ? (
        <div className="skeleton h-72 md:h-96 mt-4"></div>
      ) : (
        <div className="h-72 md:h-fit overflow-y-auto mt-4">
          <WorkAssignmentsOther />
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workAssignmentStations}
          </div>
        </div>
      ),
    [isLoading, workAssignmentStations]
  );

  const modalActions = useMemo(() => {
    return (
      <div className="modal-action">
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

  return props.isOpen ? (
    <dialog className="modal" open={props.isOpen}>
      <div className="modal-box border border-current work-assignments-content">
        <div className="gap-4 work-assignments-header">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={props.onClose}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Work Assignment Request</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="font-bold label-text">Day</span>
              </div>
              {segmentSelector}
              <div className="label">
                <span className="label-text-alt">
                  Choose the day for your work assignment request.
                </span>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="font-bold label-text">Run Group</span>
              </div>
              {runGroupSelector}
              <div className="label">
                <span className="label-text-alt">
                  Your run group is determined by your car number.
                </span>
              </div>
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
