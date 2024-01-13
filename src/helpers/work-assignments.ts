import { MSRSegment } from "../models/msr-segment";
import { MSRUser } from "../models/msr-user";
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
  const assignment = getWorkAssignment(runGroup, type, station, assignments, segment);
  return [assignment?.user, assignment?.vehicleNumber];
}

export function getWorkAssignment(
  runGroup: RunGroup,
  type: WorkAssignmentType,
  station: Station,
  assignments?: WorkAssignment[],
  segment?: MSRSegment,
): WorkAssignment | undefined {
  return assignments?.find(
    (a) => a.runGroup === runGroup && a.segment === segment && a.type === type && a.station === station
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

  const assignment = getWorkAssignment(runGroup, type, station, assignments, segment);

  const newAssignment: WorkAssignment = {
    user: user,
    vehicleNumber: vehicleNumber,
    type: type,
    station: station,
    runGroup: runGroup,
    segment: segment
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
  const assignment = getWorkAssignment(runGroup, type, station, assignments, segment);

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
  return !assignments.some((a) => a.user?.id === user.id && a.segment === segment);
}
