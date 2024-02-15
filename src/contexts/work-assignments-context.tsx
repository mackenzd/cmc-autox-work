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
import moment from "moment";

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
  const { user, canPreregister, isAdmin } = useAuthorizationContext();

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

  const availableSegments = useMemo(() => {
    const isSingleDayEvent = props.event.start === props.event.end;

    if (
      !isSingleDayEvent &&
      (isAdmin ||
        canPreregister ||
        getCurrentUserPreregistration.some((e) => e === props.event.id))
    ) {
      return Object.values(MSRSegment);
    } else if (isSingleDayEvent) {
      return [moment(props.event.start).format("dddd")] as MSRSegment[];
    } else {
      return uniq(entries.map((e) => e.segment as MSRSegment));
    }
    // eslint-disable-next-line
  }, [
    // eslint-disable-next-line
    JSON.stringify(entries),
    isAdmin,
    canPreregister,
    getCurrentUserPreregistration,
    props.event.start,
    props.event.end,
    props.event.id,
  ]);
  const [segment, setSegment] = useState<MSRSegment>(availableSegments.at(0)!);

  useEffect(() => {
    if (!segment) setSegment(availableSegments[0]);
    // eslint-disable-next-line
  }, [JSON.stringify(availableSegments), segment]);

  const vehicleNumber = useMemo(() => {
    return entries.find((e) => e.segment === segment)?.vehicleNumber;
    // eslint-disable-next-line
  }, [JSON.stringify(entries), segment]);

  const [runGroup, setRunGroup] = useState<RunGroup>(RunGroup.Odd);
  useEffect(() => {
    const userAssignment = assignments?.find(
      (a) => a.user?.id === user?.id && a.segment === segment
    );

    let defaultRunGroup: RunGroup;
    if (userAssignment) {
      defaultRunGroup = userAssignment.runGroup;
    } else {
      defaultRunGroup =
        !!vehicleNumber && parseInt(vehicleNumber.slice(-1)) % 2 === 0
          ? RunGroup.Even
          : RunGroup.Odd;
    }

    setRunGroup(defaultRunGroup);
  }, [vehicleNumber, assignments, segment, user?.id]);

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
