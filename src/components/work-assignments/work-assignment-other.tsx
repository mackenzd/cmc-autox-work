import WorkAssignmentEntry from "./work-assignment-entry";
import { Station, WorkAssignmentType } from "../../models/work-assignment";

const WorkAssignmentOther = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg-xl:grid-cols-4 gap-2 mb-2">
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Computer}
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Assistant}
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Start}
          station={Station.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid1}
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid2}
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.GateMarshal}
          station={Station.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor1}
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor2}
          station={Station.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor3}
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor4}
          station={Station.None}
        />
      </div>
    </div>
  );
};

export default WorkAssignmentOther;
