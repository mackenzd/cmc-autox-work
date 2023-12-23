import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bucket,
  WorkAssignment,
  WorkAssignmentType,
} from "../../models/work-assignment";
import {
  getUserForWorkAssignment,
  getWorkAssignment,
} from "../../helpers/work-assignments";
import { getCurrentUser } from "../../helpers/auth";
import {
  setWorkAssignment,
  unsetWorkAssignment,
} from "../../helpers/work-assignments";
import { useWorkAssignmentsContext } from "./work-assignments-context";

export interface WorkAssignmentProps {
  type: WorkAssignmentType;
  bucket: Bucket;
}

const WorkAssignmentEntry = (props: WorkAssignmentProps) => {
  const { assignments, setAssignments, runGroup } = useWorkAssignmentsContext();

  const currentUser = getCurrentUser();
  const currentCarNumber = "000";

  const curAssignment = useMemo(
    () => getWorkAssignment(assignments, runGroup, props.type, props.bucket),

    [JSON.stringify(assignments), runGroup, props.type, props.bucket]
  );

  const classNames = useMemo(() => {
    if (curAssignment && curAssignment.user?.id === currentUser?.id) {
      return "btn btn-sm btn-warning no-animation work-assignment";
    } else if (curAssignment) {
      return "btn btn-sm btn-error no-animation work-assignment";
    } else {
      return "btn btn-sm btn-success no-animation work-assignment";
    }
  }, [curAssignment, curAssignment?.user?.id, currentUser?.id]);

  const onClickDude = useCallback(() => {
    if (!curAssignment) {
      // add me if i have perms
      const myCurAss = assignments.find((a) => a.user.id === currentUser?.id);

      if (myCurAss) {
        setAssignments(
          assignments.map((a) =>
            a.user.id === currentUser?.id
              ? {
                  ...a,
                  type: props.type,
                  bucket: props.bucket,
                  runGroup: runGroup,
                }
              : a
          )
        );
      } else {
        const newAssignment = {
          user: currentUser,
          carNumber: currentCarNumber,
          type: props.type,
          bucket: props.bucket,
          runGroup: runGroup,
        };
        setAssignments([...assignments, newAssignment]);
      }
    } else if (curAssignment && curAssignment.user?.id === currentUser?.id) {
      // remove me from this plz
      setAssignments(assignments.filter((a) => a.user.id !== currentUser?.id));
    }
  }, [
    curAssignment,
    curAssignment?.user?.id,
    currentUser,
    currentUser?.id,
    currentCarNumber,
    setAssignments,
    JSON.stringify(assignments),
    props.type,
    props.bucket,
    runGroup,
  ]);

  return (
    <div className="py-1 work-assignment">
      <button className={classNames} onClick={() => onClickDude()}>
        {props.type}
      </button>
      {curAssignment ? (
        <div className="px-2">
          {curAssignment.user?.firstName} {curAssignment.user?.lastName} #
          {curAssignment.carNumber}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkAssignmentEntry;
