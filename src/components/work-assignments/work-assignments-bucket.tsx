import { Bucket, WorkAssignmentType } from "../../models/work-assignment";
import WorkAssignmentEntry from "./work-assignment-entry";

export interface WorkAssignmentBucketProps {
  bucket: Bucket;
}

const WorkAssignmentBucket = (props: WorkAssignmentBucketProps) => {
  return (
    <div>
      <div className="font-bold text-md py-2">Bucket {props.bucket}</div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Leader}
          bucket={props.bucket}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner1}
          bucket={props.bucket}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner2}
          bucket={props.bucket}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner3}
          bucket={props.bucket}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner4}
          bucket={props.bucket}
        />
      </div>
    </div>
  );
};

export default WorkAssignmentBucket;
