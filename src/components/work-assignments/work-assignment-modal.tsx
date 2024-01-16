import WorkAssignmentsOther from "./work-assignments-other";
import WorkAssignmentsStation from "./work-assignments-station";
import { RunGroup } from "../../models/run-group";
import { useWorkAssignmentsContext } from "./work-assignments-context";
import { MSRSegment } from "../../models/msr-segment";

export interface WorkAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const stationCount = 8;

const WorkAssignmentsModal = (props: WorkAssignmentsModalProps) => {
  const { availableSegments, segment, setSegment, runGroup, setRunGroup } =
    useWorkAssignmentsContext();

  const workAssignmentStations = () => {
    const stations = [];
    for (let i = 1; i <= stationCount; i++) {
      stations.push(
        <WorkAssignmentsStation key={`station-${i}`} station={i} />
      );
    }

    return stations;
  };

  return props.isOpen ? (
    <dialog className="modal" open={props.isOpen}>
      <div className="modal-box border border-current work-assignments-content">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={props.onClose}
        >
          ✕
        </button>

        <div className="gap-4 work-assignments-header">
          <h3 className="font-bold text-lg">Work Assignment Request</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="font-bold label-text">Day</span>
              </div>
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
              <div className="label">
                <span className="label-text-alt">
                  Your run group is determined by your car number.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="py-4">
          <WorkAssignmentsOther />
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <>{workAssignmentStations()}</>
        </div>
        <div className="modal-action">
          <button className="btn btn-outline btn-sm" onClick={props.onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default WorkAssignmentsModal;
