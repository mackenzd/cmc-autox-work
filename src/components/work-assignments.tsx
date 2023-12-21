import { MSREvent } from "../models/msr-event";
import WorkAssignmentsOther from "./work-assignments-other";
import WorkAssignmentsBucket from "./work-assignments-bucket";
import { RunGroup } from "../models/run-group";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../models/work-assignment";
import { useState } from "react";

export interface WorkAssignmentsModalProps {
  event: MSREvent;
  runGroup: RunGroup;
  isOpen: boolean;
  onClose: () => void;
}

const WorkAssignmentsModal = (props: WorkAssignmentsModalProps) => {
  const bucketCount = 8;
  const [runGroup, setRunGroup] = useState<RunGroup>(props.runGroup);

  let stubAssignments: WorkAssignment[] = [
    {
      user: {
        avatar: "",
        email: "",
        firstName: "Riley",
        id: "",
        lastName: "Karp",
        organizations: [],
      },
      carNumber: "37",
      type: WorkAssignmentType.Computer,
      bucket: Bucket.None,
      runGroup: RunGroup.Even,
    },
    {
      user: {
        avatar: "",
        email: "",
        firstName: "Testy",
        id: "",
        lastName: "McTesterson",
        organizations: [],
      },
      carNumber: "123",
      type: WorkAssignmentType.Runner2,
      bucket: Bucket["Bucket 5"],
      runGroup: RunGroup.Even,
    },
    {
      user: {
        avatar: "",
        email: "",
        firstName: "Earthworm",
        id: "",
        lastName: "Jim",
        organizations: [],
      },
      carNumber: "45",
      type: WorkAssignmentType.Instructor2,
      bucket: Bucket.None,
      runGroup: RunGroup.Odd,
    },
    {
      user: {
        avatar: "",
        email: "",
        firstName: "Joe",
        id: "",
        lastName: "Fred",
        organizations: [],
      },
      carNumber: "1",
      type: WorkAssignmentType.Leader,
      bucket: Bucket["Bucket 1"],
      runGroup: RunGroup.Odd,
    },
  ];

  const [assignments, setAssignments] =
    useState<WorkAssignment[]>(stubAssignments);

  const updateAssignments = (assignments: WorkAssignment[]) => {
    setAssignments(assignments)
  }

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
          <h3 className="font-bold text-lg">Work Assignments</h3>
          <div className="label-text">
            <span className="pr-3">Run Group</span>
            <select
              className="select select-bordered select-xs max-w-xs"
              value={runGroup}
              onChange={(ce) => {
                setRunGroup(ce.target.value as RunGroup);
              }}
            >
              {Object.values(RunGroup).map((rg) => (
                <option value={rg}>{rg}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="py-4">
          <WorkAssignmentsOther
            assignments={assignments}
            runGroup={runGroup}
            onSave={updateAssignments}
          />
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(bucketCount)].map((_, i) => (
            <WorkAssignmentsBucket
              bucket={i + 1}
              assignments={assignments}
              runGroup={runGroup}
              onSave={updateAssignments}
            />
          ))}
        </div>

        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={props.onClose}>
            Close
          </button>
        </div> */}
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default WorkAssignmentsModal;
