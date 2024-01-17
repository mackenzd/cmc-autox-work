import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RunGroup } from "../../models/run-group";
import { WorkAssignment } from "../../models/work-assignment";
import React from "react";
import { MSREvent } from "../../models/msr-event";
import {
  useGetEventAssignments,
  useGetEventSettings,
} from "../../hooks/events";
import { useAuthorizationContext } from "../../authorization-context";
import { MSRSegment } from "../../models/msr-segment";
import uniq from "lodash/uniq";
import { useGetWorkAssignments } from "../../hooks/work-assignment";
import { EventSettings } from "../../models/event-settings";

const setStateDefaultFunction = () => {
  return;
};

interface Props {
  event?: MSREvent;
  assignments: WorkAssignment[];
  setAssignments: (assignments: WorkAssignment[]) => void;
  runGroup: RunGroup;
  setRunGroup: (runGroup: RunGroup) => void;
  segment: MSRSegment;
  setSegment: (segment: MSRSegment) => void;
  vehicleNumber?: string;
  availableSegments: MSRSegment[];
  settings: EventSettings;
  setSettings: (settings: EventSettings) => void;
  initializeSettings: () => void;
  setInitialSettings: (settings: EventSettings) => void;
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
  settings: {},
  setSettings: setStateDefaultFunction,
  initializeSettings: setStateDefaultFunction,
  setInitialSettings: setStateDefaultFunction,
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

  const [assignments, setAssignments] = useState<WorkAssignment[]>([]);

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
  const [segment, setSegment] = useState<MSRSegment>(availableSegments.at(0)!);

  useEffect(() => {
    if (!segment) setSegment(availableSegments[0]);
  }, [JSON.stringify(availableSegments), segment]);

  let vehicleNumber = entries.find((e) => e.segment === segment)?.vehicleNumber;
  let defaultRunGroup =
    !!vehicleNumber && parseInt(vehicleNumber.charAt(-1)) % 2
      ? RunGroup.Even
      : RunGroup.Odd;
  const [runGroup, setRunGroup] = useState<RunGroup>(defaultRunGroup);

  const eventSettings = useGetEventSettings(props.event);
  const [initialSettings, setInitialSettings] =
    useState<EventSettings>(eventSettings);
  const [settings, setSettings] = useState<EventSettings>({stations: 8});

  const initializeSettings = useCallback(() => {
    if (initialSettings?.stations) {
      setSettings(initialSettings);
    } else {
      setSettings({ stations: 8 });
    }
  }, [JSON.stringify(initialSettings), setSettings]);

  useEffect(() => {
    if (!initialSettings?.stations) setInitialSettings(eventSettings);
    initializeSettings();
  }, [
    initialSettings?.stations,
    initializeSettings,
    setInitialSettings,
    JSON.stringify(eventSettings),
  ]);

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
        settings,
        setSettings,
        initializeSettings,
        setInitialSettings,
      }}
    >
      {props.children}
    </WorkAssignmentsContext.Provider>
  );
};

export const useWorkAssignmentsContext = (): Props => {
  return React.useContext<Props>(WorkAssignmentsContext);
};
