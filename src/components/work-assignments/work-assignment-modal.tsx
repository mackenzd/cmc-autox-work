import WorkAssignmentsOther from "./work-assignment-other";
import WorkAssignmentsStation from "./work-assignment-station";
import { RunGroup } from "../../models/run-group";
import { useWorkAssignmentsContext } from "../../contexts/work-assignments-context";
import { MSRSegment } from "../../models/msr-segment";
import { useMemo } from "react";
import { useAuthorizationContext } from "../../contexts/authorization-context";
import { getWorksheet } from "../../helpers/work-assignments";

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
          <button
            className="btn btn-outline btn-sm"
            onClick={() => getWorksheet(event, segment, runGroup)}
          >
            Print
          </button>
        ) : (
          <></>
        )}
        <button className="btn btn-outline btn-sm" onClick={props.onClose}>
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
