import { MSRSegment } from "../models/msr-segment";
import { MSRUser } from "../models/msr-user";
import { RunGroup } from "../models/run-group";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../models/work-assignment";

export function getUserForWorkAssignment(
  assignments: WorkAssignment[],
  runGroup: RunGroup,
  segment: MSRSegment,
  type: WorkAssignmentType,
  bucket: Bucket
): [MSRUser | undefined] | [MSRUser | undefined, string | undefined] {
  const assignment = getWorkAssignment(assignments, runGroup, type, bucket, segment);
  return [assignment?.user, assignment?.vehicleNumber];
}

export function getWorkAssignment(
  assignments: WorkAssignment[],
  runGroup: RunGroup,
  type: WorkAssignmentType,
  bucket: Bucket,
  segment?: MSRSegment,
): WorkAssignment | undefined {
  return assignments.find(
    (a) => a.runGroup === runGroup && a.segment === segment && a.type === type && a.bucket === bucket
  );
}

export function setWorkAssignment(
  assignments: WorkAssignment[],
  runGroup: RunGroup,
  segment: MSRSegment,
  type: WorkAssignmentType,
  bucket: Bucket,
  user: MSRUser,
  vehicleNumber: string,
  onCallback: () => void
): WorkAssignment[] {
  if (!canSetWorkAssignment(assignments, user, segment)) {
    return assignments;
  }

  const assignment = getWorkAssignment(assignments, runGroup, type, bucket, segment);

  const newAssignment: WorkAssignment = {
    user: user,
    vehicleNumber: vehicleNumber,
    type: type,
    bucket: bucket,
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
  bucket: Bucket,
  user: MSRUser,
  onCallback: () => void
): WorkAssignment[] {
  const assignment = getWorkAssignment(assignments, runGroup, type, bucket, segment);

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
