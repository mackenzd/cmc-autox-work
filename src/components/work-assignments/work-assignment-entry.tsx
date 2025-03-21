import { useCallback, useMemo, useState } from "react";
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
import ConfirmationDialog from "../dialogs/confirmation-dialog";
import { eventRegistraionHasEnded } from "../../helpers/events";

export interface WorkAssignmentProps {
  type: WorkAssignmentType;
  display: string;
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
    } else if (currentAssignment.user?.id !== user?.id && isAdmin) {
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
      // Clicked on your own work assignment
      currentAssignment?.user?.id === user?.id &&
      currentAssignment?.runGroup === runGroup &&
      currentAssignment.segment === segment &&
      currentAssignment.type === props.type &&
      currentAssignment.station === props.station
    ) {
      unsetWorkAssignment(currentAssignment);
    } else if (currentAssignment?.user?.id === undefined) {
      // Clicked on an empty work assignment
      setWorkAssignment(newAssignment);
    } else if (currentAssignment?.user?.id !== user?.id && isAdmin) {
      // Clicked on an assigned work assignment as an admin
      setIsConfirmationDialogOpen(true);
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
    isAdmin,
  ]);

  const requiredRole = roleForWorkAssignment(props.type);

  const hasRegistrationEnded = useMemo(() => {
    if (event) {
      return eventRegistraionHasEnded(event);
    }
  }, [event]);

  const canAssign = useMemo(() => {
    let canAssign: boolean;

    if (isRestricted || (!isAdmin && hasRegistrationEnded)) {
      canAssign = false;
    } else if (requiredRole) {
      canAssign =
        roles?.some((r) => r === requiredRole) || isAdmin || isUnrestricted;
    } else {
      canAssign = true;
    }

    return canAssign;
  }, [
    isRestricted,
    hasRegistrationEnded,
    requiredRole,
    roles,
    isAdmin,
    isUnrestricted,
  ]);

  const classNames = useMemo(() => {
    if (currentAssignment && currentAssignment.user?.id === user?.id) {
      return "btn btn-xs btn-warning no-animation work-assignment sm:btn-sm";
    } else if (currentAssignment) {
      return "btn btn-xs btn-error no-animation work-assignment sm:btn-sm";
    } else {
      return "btn btn-xs btn-success no-animation work-assignment sm:btn-sm";
    }
  }, [currentAssignment, user?.id]);

  const assigned = useMemo(() => {
    const number = currentAssignment?.vehicleNumber ? (
      "#" + currentAssignment.vehicleNumber
    ) : (
      <></>
    );

    if (currentAssignment) {
      return (
        <div className="text-xs px-2 truncate sm:text-base">
          {currentAssignment?.user?.firstName}{" "}
          {currentAssignment?.user?.lastName} {number}
        </div>
      );
    }
    // eslint-disable-next-line
  }, [JSON.stringify(currentAssignment)]);

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const confirmationDialog = useMemo(
    () =>
      isConfirmationDialogOpen ? (
        <ConfirmationDialog
          isOpen={isConfirmationDialogOpen}
          title="Remove Work Assignment?"
          message={`Are you sure you want to remove ${currentAssignment?.user?.firstName} ${currentAssignment?.user?.lastName}'s work assignment for ${currentAssignment?.segment}?`}
          onConfirm={() => {
            if (currentAssignment) {
              unsetWorkAssignment(currentAssignment);
            }
            setIsConfirmationDialogOpen(false);
          }}
          onClose={() => {
            setIsConfirmationDialogOpen(false);
          }}
        />
      ) : (
        <></>
      ),
    [
      isConfirmationDialogOpen,
      setIsConfirmationDialogOpen,
      currentAssignment,
      unsetWorkAssignment,
    ]
  );

  return (
    <div className="py-1 work-assignment">
      <button
        className={classNames}
        disabled={!canAssign}
        onClick={() => onClickWorkAssignment()}
      >
        {props.display}
      </button>
      {assigned}
      {confirmationDialog}
    </div>
  );
};

export default WorkAssignmentEntry;
