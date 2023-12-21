import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../models/work-assignment";
import { RunGroup } from "../models/run-group";
import {
  canSetWorkAssignment,
  getUserForWorkAssignment,
} from "../helpers/work-assignments";
import { getCurrentUser } from "../helpers/auth";
import {
  setWorkAssignment,
  unsetWorkAssignment,
} from "../helpers/work-assignments";

export interface WorkAssignmentProps {
  assignments: WorkAssignment[];
  runGroup: RunGroup;
  type: WorkAssignmentType;
  bucket: Bucket;
  onSave: (assignments: WorkAssignment[]) => void;
}

const WorkAssignmentEntry = (props: WorkAssignmentProps) => {
  const [isAssigned, setIsAssigned] = useState<boolean>(false);
  const currentUser = getCurrentUser();
  const currentCarNumber = "000";

  const [assignedUser, assignedCarNumber] = useMemo(
    () =>
      getUserForWorkAssignment(
        props.assignments,
        props.runGroup,
        props.type,
        props.bucket
      ),
    [props.assignments, props.runGroup, isAssigned]
  );

  useEffect(() => {
    setIsAssigned(assignedUser ? true : false);
  }, [assignedUser]);

  const classNames = useMemo(() => {
    let classNames: string;
    if (isAssigned && assignedUser?.id === currentUser?.id) {
      classNames = "btn btn-sm btn-warning no-animation work-assignment";
    } else if (isAssigned) {
      classNames = "btn btn-sm btn-error no-animation work-assignment";
    } else {
      classNames = "btn btn-sm btn-success no-animation work-assignment";
    }

    return classNames;
  }, [isAssigned]);

  function onSave(): WorkAssignment[] {
    if (!isAssigned) {
      return setWorkAssignment(
        props.assignments,
        props.runGroup,
        props.type,
        props.bucket,
        currentUser,
        currentCarNumber,
        () => setIsAssigned(true)
      );
    } else if (isAssigned && assignedUser?.id === currentUser?.id) {
      return unsetWorkAssignment(
        props.assignments,
        props.runGroup,
        props.type,
        props.bucket,
        currentUser,
        () => setIsAssigned(false)
      );
    } else {
      return props.assignments;
    }
  }

  return (
    <div className="py-1 work-assignment">
      <button className={classNames} onClick={() => props.onSave(onSave())}>
        {props.type}
      </button>
      {isAssigned ? (
        <div className="px-2">
          {assignedUser?.firstName} {assignedUser?.lastName} #
          {assignedCarNumber}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkAssignmentEntry;
