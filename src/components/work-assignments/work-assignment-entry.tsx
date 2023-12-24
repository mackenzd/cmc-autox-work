import { useCallback, useMemo } from "react";
import {
  Bucket,
  WorkAssignmentType,
} from "../../models/work-assignment";
import {
  getWorkAssignment,
} from "../../helpers/work-assignments";
import { getCurrentUser } from "../../helpers/auth";
import { useWorkAssignmentsContext } from "./work-assignments-context";

export interface WorkAssignmentProps {
  type: WorkAssignmentType;
  bucket: Bucket;
}

const WorkAssignmentEntry = (props: WorkAssignmentProps) => {
  const { assignments, setAssignments, runGroup } = useWorkAssignmentsContext();

  const currentUser = getCurrentUser();
  const currentCarNumber = "000";

  const currentAssignment = useMemo(
    () => getWorkAssignment(assignments, runGroup, props.type, props.bucket),

    [JSON.stringify(assignments), runGroup, props.type, props.bucket]
  );

  const classNames = useMemo(() => {
    if (currentAssignment && currentAssignment.user?.id === currentUser?.id) {
      return "btn btn-sm btn-warning no-animation work-assignment";
    } else if (currentAssignment) {
      return "btn btn-sm btn-error no-animation work-assignment";
    } else {
      return "btn btn-sm btn-success no-animation work-assignment";
    }
  }, [currentAssignment, currentAssignment?.user?.id, currentUser?.id]);

  const onClickWorkAssignment = useCallback(() => {
    if (!currentAssignment) {
      const currentUserAssignment = assignments.find((a) => a.user.id === currentUser?.id);

      if (currentUserAssignment) {
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
    } else if (currentAssignment && currentAssignment.user?.id === currentUser?.id) {
      setAssignments(assignments.filter((a) => a.user.id !== currentUser?.id));
    }
  }, [
    currentAssignment,
    currentAssignment?.user?.id,
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
      <button className={classNames} onClick={() => onClickWorkAssignment()}>
        {props.type}
      </button>
      {currentAssignment ? (
        <div className="px-2">
          {currentAssignment.user?.firstName} {currentAssignment.user?.lastName} #
          {currentAssignment.carNumber}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkAssignmentEntry;
