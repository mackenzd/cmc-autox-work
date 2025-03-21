import WorkAssignmentEntry from "./work-assignment-entry";
import { Station, WorkAssignmentType } from "../../models/work-assignment";
import { useMemo } from "react";

export interface WorkAssignmentOtherProps {
  assistants: number;
}

const WorkAssignmentOther = (props: WorkAssignmentOtherProps) => {
  const workAssignmentAssistants = useMemo(() => {
    const assistants = [
      <WorkAssignmentEntry
        type={WorkAssignmentType.Assistant1}
        display="Assistant"
        station={Station.None}
      />,
    ];

    if (props.assistants > 1) {
      assistants.push(
        <WorkAssignmentEntry
          type={WorkAssignmentType.Assistant2}
          display="Assistant"
          station={Station.None}
        />
      );
    }

    return assistants;
  }, [props.assistants]);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg-xl:grid-cols-4 gap-2 mb-2">
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Computer}
          display="Computer"
          station={Station.None}
        />
        {workAssignmentAssistants}
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Start}
          display="Start"
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.GateMarshal}
          display="Gate Marshal"
          station={Station.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid1}
          display="Grid"
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Grid2}
          display="Grid"
          station={Station.None}
        />
      </div>
      <div>
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor1}
          display="Instructor"
          station={Station.None}
        />
        <WorkAssignmentEntry
          type={WorkAssignmentType.Instructor2}
          display="Instructor"
          station={Station.None}
        />
      </div>
    </div>
  );
};

export default WorkAssignmentOther;
