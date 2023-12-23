import { PropsWithChildren, createContext, useState } from "react";
import { RunGroup } from "../../models/run-group";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../../models/work-assignment";
import React from "react";
import { MSREvent } from "../../models/msr-event";

const stubAssignments: WorkAssignment[] = [
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
    bucket: Bucket.Bucket5,
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
    bucket: Bucket.Bucket1,
    runGroup: RunGroup.Odd,
  },
];

const stubDefaultRunGroup = RunGroup.Even;

const setStateDefaultFunction = () => {
  return;
};

interface Props {
  assignments: WorkAssignment[];
  setAssignments: (assignments: WorkAssignment[]) => void;
  runGroup: RunGroup;
  setRunGroup: (runGroup: RunGroup) => void;
}

export const DefaultContext: Props = {
  assignments: [],
  setAssignments: setStateDefaultFunction,
  runGroup: RunGroup.Even,
  setRunGroup: setStateDefaultFunction,
};

const WorkAssignmentsContext = createContext<Props>(DefaultContext);

interface ContextProps {
  event: MSREvent;
}

export const WorkAssignmentsContextProvider = (
  props: PropsWithChildren<ContextProps>
) => {
  const [assignments, setAssignments] =
    useState<WorkAssignment[]>(stubAssignments);
  const [runGroup, setRunGroup] = useState<RunGroup>(stubDefaultRunGroup);

  return (
    <WorkAssignmentsContext.Provider
      value={{
        assignments,
        setAssignments,
        runGroup,
        setRunGroup,
      }}
    >
      {props.children}
    </WorkAssignmentsContext.Provider>
  );
};
export const useWorkAssignmentsContext = (): Props => {
  return React.useContext<Props>(WorkAssignmentsContext);
};
