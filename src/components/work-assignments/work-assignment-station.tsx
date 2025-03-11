import { Station, WorkAssignmentType } from "../../models/work-assignment";
import WorkAssignmentEntry from "./work-assignment-entry";

export interface WorkAssignmentStationProps {
  station: Station;
}

const WorkAssignmentStation = (props: WorkAssignmentStationProps) => {
  return (
    <div>
      <div className="font-bold text-md py-1">Station {props.station}</div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Leader}
          display="Leader"
          station={props.station}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner1}
          display="Runner"
          station={props.station}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner2}
          display="Runner"
          station={props.station}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Runner3}
          display="Runner"
          station={props.station}
        />
      </div>
    </div>
  );
};

export default WorkAssignmentStation;
