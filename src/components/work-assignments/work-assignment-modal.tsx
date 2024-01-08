import WorkAssignmentsOther from "./work-assignments-other";
import WorkAssignmentsBucket from "./work-assignments-bucket";
import { RunGroup } from "../../models/run-group";
import { useWorkAssignmentsContext } from "./work-assignments-context";

export interface WorkAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const bucketCount = 8;

const WorkAssignmentsModal = (props: WorkAssignmentsModalProps) => {
  const { runGroup, setRunGroup } = useWorkAssignmentsContext();

  const workAssignmentBuckets = () => {
    const buckets = [];
    for (let i = 1; i <= bucketCount; i++) {
      buckets.push(<WorkAssignmentsBucket key={`bucket-${i}`} bucket={i} />);
    }

    return buckets;
  };

  return props.isOpen ? (
    <dialog className="modal" open={props.isOpen}>
      <div className="modal-box work-assignments-content">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={props.onClose}
        >
          ✕
        </button>

        <div className="gap-4 work-assignments-header">
          <h3 className="font-bold text-lg">Work Assignment Request</h3>
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
              <span className="label-text-alt">Your default run group is determined by your car number.</span>
            </div>
          </label>
        </div>

        <div className="py-4">
          <WorkAssignmentsOther />
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <>{workAssignmentBuckets()}</>
        </div>
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default WorkAssignmentsModal;
