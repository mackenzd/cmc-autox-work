import WorkAssignmentEntry from "./work-assignment-entry";
import {
  Bucket,
  WorkAssignmentType,
} from "../../models/work-assignment";

const WorkAssignmentOther = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Computer}
          bucket={Bucket.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Assistant}
          bucket={Bucket.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Start}
          bucket={Bucket.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid1}
          bucket={Bucket.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid2}
          bucket={Bucket.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.GateMarshal}
          bucket={Bucket.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor1}
          bucket={Bucket.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor2}
          bucket={Bucket.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor3}
          bucket={Bucket.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor4}
          bucket={Bucket.None}
        />
      </div>
    </div>
  );
};

export default WorkAssignmentOther;
