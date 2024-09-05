import { MSREvent } from "../models/msr-event";
import { MSRSegment } from "../models/msr-segment";
import { MSRUser } from "../models/msr-user";
import { Role } from "../models/roles";
import { RunGroup } from "../models/run-group";
import {
  Station,
  WorkAssignment,
  WorkAssignmentType,
} from "../models/work-assignment";

export function getUserForWorkAssignment(
  assignments: WorkAssignment[],
  runGroup: RunGroup,
  segment: MSRSegment,
  type: WorkAssignmentType,
  station: Station
): [MSRUser | undefined] | [MSRUser | undefined, string | undefined] {
  const assignment = getWorkAssignment(
    runGroup,
    type,
    station,
    assignments,
    segment
  );
  return [assignment?.user, assignment?.vehicleNumber];
}

export function getWorkAssignment(
  runGroup: RunGroup,
  type: WorkAssignmentType,
  station: Station,
  assignments?: WorkAssignment[],
  segment?: MSRSegment
): WorkAssignment | undefined {
  return assignments?.find(
    (a) =>
      a.runGroup === runGroup &&
      a.segment === segment &&
      a.type === type &&
      a.station === station
  );
}

export function setWorkAssignment(
  assignments: WorkAssignment[],
  runGroup: RunGroup,
  segment: MSRSegment,
  type: WorkAssignmentType,
  station: Station,
  user: MSRUser,
  vehicleNumber: string,
  onCallback: () => void
): WorkAssignment[] {
  if (!canSetWorkAssignment(assignments, user, segment)) {
    return assignments;
  }

  const assignment = getWorkAssignment(
    runGroup,
    type,
    station,
    assignments,
    segment
  );

  const newAssignment: WorkAssignment = {
    user: user,
    vehicleNumber: vehicleNumber,
    type: type,
    station: station,
    runGroup: runGroup,
    segment: segment,
  };

  if (assignment) {
    assignments.splice(assignments.indexOf(assignment), 1, newAssignment);
  } else {
    assignments.push(newAssignment);
  }

  onCallback();

  return assignments;
}

export function unsetWorkAssignment(
  assignments: WorkAssignment[],
  runGroup: RunGroup,
  segment: MSRSegment,
  type: WorkAssignmentType,
  station: Station,
  user: MSRUser,
  onCallback: () => void
): WorkAssignment[] {
  const assignment = getWorkAssignment(
    runGroup,
    type,
    station,
    assignments,
    segment
  );

  if (assignment?.user?.id === user.id) {
    assignments.splice(assignments.indexOf(assignment));
  }

  onCallback();

  return assignments;
}

export function canSetWorkAssignment(
  assignments: WorkAssignment[],
  user: MSRUser,
  segment: MSRSegment
): boolean {
  return !assignments.some(
    (a) => a.user?.id === user.id && a.segment === segment
  );
}

export function roleForWorkAssignment(
  type: WorkAssignmentType
): Role | undefined {
  switch (type) {
    case WorkAssignmentType.Computer:
      return Role.Computer;

    case WorkAssignmentType.Assistant:
      return Role.Assistant;

    case WorkAssignmentType.Grid1:
    case WorkAssignmentType.Grid2:
      return Role.Grid;

    case WorkAssignmentType.GateMarshal:
      return Role.GateMarshal;

    case WorkAssignmentType.Instructor1:
    case WorkAssignmentType.Instructor2:
    case WorkAssignmentType.Instructor3:
    case WorkAssignmentType.Instructor4:
      return Role.Instructor;

    case WorkAssignmentType.Start:
      return Role.Start;

    default:
      return undefined;
  }
}

export function getWorksheet(
  event?: MSREvent,
  segment?: MSRSegment,
  runGroup?: RunGroup
): void {
  const params: string[] = [];
  if (event?.name) {
    let title =
      event?.start === event?.end
        ? event.name
        : [event.name, segment].filter(Boolean).join(" -- ");
    params.push(`title=${encodeURIComponent(title)}`);
  }
  if (segment) {
    params.push(`segment=${encodeURIComponent(segment)}`);
  }
  if (runGroup) {
    params.push(`runGroup=${encodeURIComponent(runGroup)}`);
  }

  fetch(
    `/templates/events/${event?.id}/work_assignments.html${
      params.length > 0 ? `?${params.join("&")}` : ""
    }`
  )
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      let tab = window.open("", "_blank");
      if (tab) {
        tab.document.write(data);
        tab.document.title = `${event?.name} -- ${segment} ${runGroup}`;
        tab.document.close();
      }
    })
    .catch((error) => console.log(error));
}

export function getRegistrations(event?: MSREvent, segment?: MSRSegment): void {
  const params: string[] = [];
  if (event?.name) {
    let title =
      event?.start === event?.end
        ? event.name
        : [event.name, segment].filter(Boolean).join(" -- ");
    params.push(`title=${encodeURIComponent(title)}`);
  }
  if (segment) {
    params.push(`segment=${encodeURIComponent(segment)}`);
  }

  fetch(
    `/templates/events/${event?.id}/registrations.html${
      params.length > 0 ? `?${params.join("&")}` : ""
    }`
  )
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      let tab = window.open("", "_blank");
      if (tab) {
        tab.document.write(data);
        tab.document.title = `${event?.name} -- ${segment}`;
        tab.document.close();
      }
    })
    .catch((error) => console.log(error));
}
