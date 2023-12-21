import { RunGroup } from "../models/run-group";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../models/work-assignment";
import WorkAssignmentEntry from "./work-assignment";

export interface WorkAssignmentBucketProps {
  assignments: WorkAssignment[];
  runGroup: RunGroup;
  bucket: Bucket;
  onSave: (assignments: WorkAssignment[]) => void;
}

const WorkAssignmentBucket = (props: WorkAssignmentBucketProps) => {
  return (
    <div>
      <div className="font-bold text-md py-2">Bucket {props.bucket}</div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Leader}
          runGroup={props.runGroup}
          bucket={props.bucket}
          assignments={props.assignments}
          onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner1}
          runGroup={props.runGroup}
          bucket={props.bucket}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner2}
          runGroup={props.runGroup}
          bucket={props.bucket}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner3}
          runGroup={props.runGroup}
          bucket={props.bucket}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner4}
          runGroup={props.runGroup}
          bucket={props.bucket}
          assignments={props.assignments}
           onSave={(a) => props.onSave(a)}
        />
      </div>
    </div>
  );
};

export default WorkAssignmentBucket;
