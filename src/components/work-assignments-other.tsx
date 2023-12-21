import WorkAssignmentEntry from "./work-assignment";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../models/work-assignment";
import { RunGroup } from "../models/run-group";

export interface WorkAssignmentsOtherProps {
  assignments: WorkAssignment[];
  runGroup: RunGroup;
  onSave: (assignments: WorkAssignment[]) => void;
}

const WorkAssignmentOther = (props: WorkAssignmentsOtherProps) => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Computer}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Assistant}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Start}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid1}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid2}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.GateMarshal}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor1}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor2}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor3}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor4}
          runGroup={props.runGroup}
          bucket={Bucket.None}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
      </div>
    </div>
  );
};

export default WorkAssignmentOther;
