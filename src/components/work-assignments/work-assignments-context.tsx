import {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RunGroup } from "../../models/run-group";
import {
  Station,
  WorkAssignment,
  WorkAssignmentType,
} from "../../models/work-assignment";
import React from "react";
import { MSREvent } from "../../models/msr-event";
import { useGetEventAssignments } from "../../hooks/events";
import { useAuthorizationContext } from "../../authorization-context";
import { MSRSegment } from "../../models/msr-segment";
import uniq from "lodash/uniq";
import { useGetWorkAssignments } from "../../hooks/work-assignment";

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
    station: Station.None,
    runGroup: RunGroup.Even,
    segment: MSRSegment.Saturday,
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
    station: Station.Station5,
    runGroup: RunGroup.Even,
    segment: MSRSegment.Saturday,
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
    station: Station.None,
    runGroup: RunGroup.Odd,
    segment: MSRSegment.Saturday,
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
    station: Station.Station1,
    runGroup: RunGroup.Odd,
    segment: MSRSegment.Saturday,
  },
  {
    user: {
      avatar: "",
      email: "",
      firstName: "Billy",
      id: "",
      lastName: "Bob",
      organizations: [],
    },
    vehicleNumber: "1",
    type: WorkAssignmentType.Leader,
    station: Station.Station2,
    runGroup: RunGroup.Odd,
    segment: MSRSegment.Sunday,
  },
  {
    user: {
      avatar: "",
      email: "",
      firstName: "Pinchy",
      id: "",
      lastName: "Crab",
      organizations: [],
    },
    vehicleNumber: "1",
    type: WorkAssignmentType.Instructor3,
    station: Station.None,
    runGroup: RunGroup.Even,
    segment: MSRSegment.Sunday,
  },
];

const setStateDefaultFunction = () => {
  return;
};

interface Props {
  event?: MSREvent;
  assignments: WorkAssignment[];
  setAssignments: (assignments: WorkAssignment[]) => void;
  runGroup: RunGroup;
  setRunGroup: (runGroup: RunGroup) => void;
  segment?: MSRSegment;
  setSegment: (segment: MSRSegment) => void;
  vehicleNumber?: string;
  availableSegments: MSRSegment[];
}

export const DefaultContext: Props = {
  event: undefined,
  assignments: [],
  setAssignments: setStateDefaultFunction,
  runGroup: RunGroup.Odd,
  setRunGroup: setStateDefaultFunction,
  segment: MSRSegment.Saturday,
  setSegment: setStateDefaultFunction,
  vehicleNumber: undefined,
  availableSegments: [],
};

const WorkAssignmentsContext = createContext<Props>(DefaultContext);

interface ContextProps {
  event: MSREvent;
}

export const WorkAssignmentsContextProvider = (
  props: PropsWithChildren<ContextProps>
) => {
  const { user } = useAuthorizationContext();
  const eventAssignments = useGetEventAssignments(props.event);
  const workAssignments = useGetWorkAssignments(props.event);

  const [assignments, setAssignments] =
    useState<WorkAssignment[]>([]);

  const entries = eventAssignments?.filter(
    (assignment) =>
      assignment.firstName === user?.firstName &&
      assignment.lastName === user?.lastName
  );

  useEffect(() => {
    setAssignments(workAssignments);
  }, [JSON.stringify(workAssignments)]);

  const availableSegments = useMemo(
    () => uniq(entries.map((e) => e.segment as MSRSegment)),
    [JSON.stringify(entries)]
  );
  const [segment, setSegment] = useState<MSRSegment | undefined>(
    availableSegments.at(0)
  );

  useEffect(() => {
    if (!segment) setSegment(availableSegments[0]);
  }, [JSON.stringify(availableSegments), segment]);

  let vehicleNumber = entries.find((e) => e.segment === segment)?.vehicleNumber;
  let defaultRunGroup =
    !!vehicleNumber && parseInt(vehicleNumber.charAt(-1)) % 2
      ? RunGroup.Even
      : RunGroup.Odd;
  const [runGroup, setRunGroup] = useState<RunGroup>(defaultRunGroup);

  return (
    <WorkAssignmentsContext.Provider
      value={{
        event: props.event,
        assignments,
        setAssignments,
        runGroup,
        setRunGroup,
        segment,
        setSegment,
        vehicleNumber,
        availableSegments,
      }}
    >
      {props.children}
    </WorkAssignmentsContext.Provider>
  );
};

export const useWorkAssignmentsContext = (): Props => {
  return React.useContext<Props>(WorkAssignmentsContext);
};
