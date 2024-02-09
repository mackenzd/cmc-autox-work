import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RunGroup } from "../models/run-group";
import { WorkAssignment } from "../models/work-assignment";
import React from "react";
import { MSREvent } from "../models/msr-event";
import { useGetEventAssignments, useGetEventSettings } from "../hooks/events";
import { useAuthorizationContext } from "./authorization-context";
import { MSRSegment } from "../models/msr-segment";
import uniq from "lodash/uniq";
import { useGetWorkAssignments } from "../hooks/work-assignments";
import { EventSettings } from "../models/event-settings";
import { useGetCurrentUserPreregistration } from "../hooks/users";

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
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

interface ContextProps {
  event: MSREvent;
}

const setStateDefaultFunction = () => {
  return;
};

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
  isLoading: true,
  setIsLoading: setStateDefaultFunction,
};

const WorkAssignmentsContext = createContext<Props>(DefaultContext);

export const WorkAssignmentsContextProvider = (
  props: PropsWithChildren<ContextProps>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, canPreregister } = useAuthorizationContext();

  const [eventAssignmentsIsLoading, setEventAssignmentsIsLoading] =
    useState<boolean>(true);
  const getEventAssignments = useGetEventAssignments(
    () => setEventAssignmentsIsLoading(false),
    props.event
  );
  const [workAssignmentsIsLoading, setWorkAssignmentsIsLoading] =
    useState<boolean>(true);
  const getWorkAssignments = useGetWorkAssignments(
    () => setWorkAssignmentsIsLoading(false),
    props.event
  );
  const [eventSettingsIsLoading, setEventSettingsIsLoading] =
    useState<boolean>(true);
  const getEventSettings = useGetEventSettings(
    () => setEventSettingsIsLoading(false),
    props.event
  );
  const [
    currentUserPreregistrationIsLoading,
    setCurrentUserPreregistrationIsLoading,
  ] = useState<boolean>(true);
  const getCurrentUserPreregistration = useGetCurrentUserPreregistration(() =>
    setCurrentUserPreregistrationIsLoading(false)
  );

  useEffect(() => {
    if (
      !eventAssignmentsIsLoading &&
      !workAssignmentsIsLoading &&
      !eventSettingsIsLoading &&
      !currentUserPreregistrationIsLoading
    ) {
      setIsLoading(false);
    }
  }, [
    eventAssignmentsIsLoading,
    workAssignmentsIsLoading,
    eventSettingsIsLoading,
    currentUserPreregistrationIsLoading,
  ]);

  const [assignments, setAssignments] = useState<WorkAssignment[]>([]);
  useEffect(() => {
    setAssignments(getWorkAssignments);
    // eslint-disable-next-line
  }, [JSON.stringify(getWorkAssignments)]);

  const entries = useMemo(() => {
    return getEventAssignments?.filter(
      (assignment) =>
        assignment.firstName === user?.firstName &&
        assignment.lastName === user?.lastName
    );
  }, [getEventAssignments, user?.firstName, user?.lastName]);

  const availableSegments = useMemo(
    () => {
      if (
        canPreregister ||
        getCurrentUserPreregistration.some((e) => e === props.event.id)
      ) {
        return Object.values(MSRSegment);
      } else {
        return uniq(entries.map((e) => e.segment as MSRSegment));
      }
    },
    // eslint-disable-next-line
    [JSON.stringify(entries), canPreregister, getCurrentUserPreregistration]
  );
  const [segment, setSegment] = useState<MSRSegment>(availableSegments.at(0)!);

  useEffect(() => {
    if (!segment) setSegment(availableSegments[0]);
    // eslint-disable-next-line
  }, [JSON.stringify(availableSegments), segment]);

  let vehicleNumber = entries.find((e) => e.segment === segment)?.vehicleNumber;
  let defaultRunGroup =
    !!vehicleNumber && parseInt(vehicleNumber.charAt(-1)) % 2
      ? RunGroup.Even
      : RunGroup.Odd;
  const [runGroup, setRunGroup] = useState<RunGroup>(defaultRunGroup);

  const defaultSettings: EventSettings = {
    stations: 8,
    preregistrationAccess: [],
  };

  const [initialSettings, setInitialSettings] =
    useState<EventSettings>(getEventSettings);
  const [settings, setSettings] = useState<EventSettings>(defaultSettings);

  const initializeSettings = useCallback(() => {
    if (initialSettings?.stations) {
      setSettings(initialSettings);
    } else {
      setSettings(defaultSettings);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(initialSettings), setSettings]);

  useEffect(() => {
    if (!initialSettings?.stations) setInitialSettings(getEventSettings);
    initializeSettings();
    // eslint-disable-next-line
  }, [
    initialSettings?.stations,
    initializeSettings,
    setInitialSettings,
    // eslint-disable-next-line
    JSON.stringify(getEventSettings),
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
        isLoading,
        setIsLoading,
      }}
    >
      {props.children}
    </WorkAssignmentsContext.Provider>
  );
};

export const useWorkAssignmentsContext = (): Props => {
  return React.useContext<Props>(WorkAssignmentsContext);
};
