import { useCallback, useMemo } from "react";
import { Station, WorkAssignmentType } from "../../models/work-assignment";
import {
  getWorkAssignment,
  roleForWorkAssignment,
} from "../../helpers/work-assignments";
import { useWorkAssignmentsContext } from "../../contexts/work-assignments-context";
import { useAuthorizationContext } from "../../contexts/authorization-context";
import {
  useSetWorkAssignment,
  useUnsetWorkAssignment,
} from "../../hooks/work-assignments";

export interface WorkAssignmentProps {
  type: WorkAssignmentType;
  station: Station;
}

const WorkAssignmentEntry = (props: WorkAssignmentProps) => {
  const {
    event,
    vehicleNumber,
    assignments,
    setAssignments,
    runGroup,
    segment,
  } = useWorkAssignmentsContext();
  const { user, roles, isAdmin, isUnrestricted, isRestricted } =
    useAuthorizationContext();

  const currentAssignment = useMemo(
    () =>
      getWorkAssignment(
        runGroup,
        props.type,
        props.station,
        assignments,
        segment
      ),
    // eslint-disable-next-line
    [JSON.stringify(assignments), runGroup, segment, props.type, props.station]
  );

  const newAssignment = useMemo(
    () => ({
      user: user,
      vehicleNumber: vehicleNumber,
      type: props.type,
      station: props.station,
      runGroup: runGroup,
      segment: segment,
    }),
    [user, vehicleNumber, props.type, props.station, runGroup, segment]
  );

  const onSuccess = useCallback(() => {
    if (!currentAssignment) {
      const userAssignment = assignments?.find(
        (a) => a.user?.id === user?.id && a.segment === segment
      );

      if (userAssignment) {
        setAssignments(
          assignments?.map((a) =>
            a.user?.id === user?.id && a.segment === segment
              ? {
                  ...a,
                  type: props.type,
                  station: props.station,
                  runGroup: runGroup,
                }
              : a
          )
        );
      } else {
        setAssignments([...assignments, newAssignment]);
      }
    } else if (currentAssignment.user?.id === user?.id) {
      setAssignments(assignments.filter((a) => a !== currentAssignment));
    }
    // eslint-disable-next-line
  }, [
    currentAssignment,
    currentAssignment?.user?.id,
    newAssignment,
    user,
    user?.id,
    vehicleNumber,
    setAssignments,
    // eslint-disable-next-line
    JSON.stringify(assignments),
    props.type,
    props.station,
    runGroup,
    segment,
  ]);

  const setWorkAssignment = useSetWorkAssignment(onSuccess, event);
  const unsetWorkAssignment = useUnsetWorkAssignment(onSuccess, event);

  const onClickWorkAssignment = useCallback(() => {
    if (
      currentAssignment?.user?.id === user?.id &&
      currentAssignment?.runGroup === runGroup &&
      currentAssignment.segment === segment &&
      currentAssignment.type === props.type &&
      currentAssignment.station === props.station
    ) {
      unsetWorkAssignment(currentAssignment);
    } else if (currentAssignment?.user?.id === undefined) {
      setWorkAssignment(newAssignment);
    }
  }, [
    currentAssignment,
    props.station,
    props.type,
    runGroup,
    segment,
    unsetWorkAssignment,
    user?.id,
    setWorkAssignment,
    newAssignment,
  ]);

  const requiredRole = roleForWorkAssignment(props.type);

  let canAssign: boolean;
  if (isRestricted) {
    canAssign = false;
  } else if (requiredRole) {
    canAssign =
      roles?.some((r) => r === requiredRole) || isAdmin || isUnrestricted;
  } else {
    canAssign = true;
  }

  const classNames = useMemo(() => {
    if (currentAssignment && currentAssignment.user?.id === user?.id) {
      return "btn btn-sm btn-warning no-animation work-assignment";
    } else if (currentAssignment) {
      return "btn btn-sm btn-error no-animation work-assignment";
    } else {
      return "btn btn-sm btn-success no-animation work-assignment";
    }
  }, [currentAssignment, user?.id]);

  return (
    <div className="py-1 work-assignment">
      <button
        className={classNames}
        disabled={!canAssign}
        onClick={() => onClickWorkAssignment()}
      >
        {props.type}
      </button>
      {currentAssignment ? (
        <div className="px-2">
          {currentAssignment.user?.firstName} {currentAssignment.user?.lastName}{" "}
          {currentAssignment.vehicleNumber ? (
            "#" + currentAssignment.vehicleNumber
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkAssignmentEntry;
