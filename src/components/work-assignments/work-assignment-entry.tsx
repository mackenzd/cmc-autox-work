import { useCallback, useMemo } from "react";
import { Station, WorkAssignmentType } from "../../models/work-assignment";
import { getWorkAssignment } from "../../helpers/work-assignments";
import { useWorkAssignmentsContext } from "./work-assignments-context";
import { useAuthorizationContext } from "../../authorization-context";
import { useSetWorkAssignment } from "../../hooks/work-assignment";

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
  const { user } = useAuthorizationContext();

  const currentAssignment = useMemo(
    () =>
      getWorkAssignment(
        runGroup,
        props.type,
        props.station,
        assignments,
        segment
      ),
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
    } else if (currentAssignment && currentAssignment.user?.id === user?.id) {
      setAssignments(assignments?.filter((a) => a.user?.id !== user?.id));
    }
  }, [
    currentAssignment,
    currentAssignment?.user?.id,
    newAssignment,
    user,
    user?.id,
    vehicleNumber,
    setAssignments,
    JSON.stringify(assignments),
    props.type,
    props.station,
    runGroup,
    segment,
  ]);

  const posterDude = useSetWorkAssignment(onSuccess, event);

  const onClickWorkAssignment = useCallback(() => {
    posterDude(newAssignment);
  }, [posterDude, newAssignment]);

  const classNames = useMemo(() => {
    if (currentAssignment && currentAssignment.user?.id === user?.id) {
      return "btn btn-sm btn-warning no-animation work-assignment";
    } else if (currentAssignment) {
      return "btn btn-sm btn-error no-animation work-assignment";
    } else {
      return "btn btn-sm btn-success no-animation work-assignment";
    }
  }, [currentAssignment, currentAssignment?.user?.id, user?.id]);

  return (
    <div className="py-1 work-assignment">
      <button className={classNames} onClick={() => onClickWorkAssignment()}>
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
