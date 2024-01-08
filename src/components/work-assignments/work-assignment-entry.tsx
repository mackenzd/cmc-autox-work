import { useCallback, useMemo } from "react";
import {
  Bucket,
  WorkAssignmentType,
} from "../../models/work-assignment";
import {
  getWorkAssignment,
} from "../../helpers/work-assignments";
import { useWorkAssignmentsContext } from "./work-assignments-context";
import { useAuthorizationContext } from "../../authorization-context";

export interface WorkAssignmentProps {
  type: WorkAssignmentType;
  bucket: Bucket;
}

const WorkAssignmentEntry = (props: WorkAssignmentProps) => {
  const { vehicleNumber, assignments, setAssignments, runGroup } = useWorkAssignmentsContext();

  const {user} = useAuthorizationContext();

  const currentAssignment = useMemo(
    () => getWorkAssignment(assignments, runGroup, props.type, props.bucket),

    [JSON.stringify(assignments), runGroup, props.type, props.bucket]
  );

  const classNames = useMemo(() => {
    if (currentAssignment && currentAssignment.user?.id === user?.id) {
      return "btn btn-sm btn-warning no-animation work-assignment";
    } else if (currentAssignment) {
      return "btn btn-sm btn-error no-animation work-assignment";
    } else {
      return "btn btn-sm btn-success no-animation work-assignment";
    }
  }, [currentAssignment, currentAssignment?.user?.id, user?.id]);

  const onClickWorkAssignment = useCallback(() => {
    if (!currentAssignment) {
      const currentUserAssignment = assignments.find((a) => a.user?.id === user?.id);

      if (currentUserAssignment) {
        setAssignments(
          assignments.map((a) =>
            a.user?.id === user?.id
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
          user: user,
          vehicleNumber: vehicleNumber,
          type: props.type,
          bucket: props.bucket,
          runGroup: runGroup,
        };
        setAssignments([...assignments, newAssignment]);
      }
    } else if (currentAssignment && currentAssignment.user?.id === user?.id) {
      setAssignments(assignments.filter((a) => a.user?.id !== user?.id));
    }
  }, [
    currentAssignment,
    currentAssignment?.user?.id,
    user,
    user?.id,
    vehicleNumber,
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
          {currentAssignment.user?.firstName} {currentAssignment.user?.lastName} {currentAssignment.vehicleNumber ? "#" + currentAssignment.vehicleNumber : <></>}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkAssignmentEntry;
