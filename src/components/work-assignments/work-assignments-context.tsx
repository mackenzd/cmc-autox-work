import { PropsWithChildren, createContext, useState } from "react";
import { RunGroup } from "../../models/run-group";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../../models/work-assignment";
import React from "react";
import { MSREvent } from "../../models/msr-event";
import { useGetEventAssignments } from "../../hooks/events";
import { useAuthorizationContext } from "../../authorization-context";

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
    vehicleNumber: "37",
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
    vehicleNumber: "123",
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
    vehicleNumber: "45",
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
    vehicleNumber: "1",
    type: WorkAssignmentType.Leader,
    bucket: Bucket.Bucket1,
    runGroup: RunGroup.Odd,
  },
];

const setStateDefaultFunction = () => {
  return;
};

interface Props {
  assignments: WorkAssignment[];
  setAssignments: (assignments: WorkAssignment[]) => void;
  runGroup: RunGroup;
  setRunGroup: (runGroup: RunGroup) => void;
  vehicleNumber?: string;
}

export const DefaultContext: Props = {
  assignments: [],
  setAssignments: setStateDefaultFunction,
  runGroup: RunGroup.Odd,
  setRunGroup: setStateDefaultFunction,
  vehicleNumber: undefined,
};

const WorkAssignmentsContext = createContext<Props>(DefaultContext);

interface ContextProps {
  event: MSREvent;
}

export const WorkAssignmentsContextProvider = (
  props: PropsWithChildren<ContextProps>
) => {
  const eventAssignments = useGetEventAssignments(props.event);
  const { user } = useAuthorizationContext();
  const vehicleNumber = eventAssignments?.find(
    (assignment) =>
      assignment.firstName === user?.firstName &&
      assignment.lastName === user?.lastName
  )?.vehicleNumber;

  const [assignments, setAssignments] =
    useState<WorkAssignment[]>(stubAssignments);
  const [runGroup, setRunGroup] = useState<RunGroup>(
    vehicleNumber && parseInt(vehicleNumber.charAt(-1)) % 2
      ? RunGroup.Even
      : RunGroup.Odd
  );

  return (
    <WorkAssignmentsContext.Provider
      value={{
        assignments,
        setAssignments,
        runGroup,
        setRunGroup,
        vehicleNumber: vehicleNumber,
      }}
    >
      {props.children}
    </WorkAssignmentsContext.Provider>
  );
};

export const useWorkAssignmentsContext = (): Props => {
  return React.useContext<Props>(WorkAssignmentsContext);
};
