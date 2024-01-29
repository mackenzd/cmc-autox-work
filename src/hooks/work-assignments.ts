import { useEffect, useState } from "react";
import { WorkAssignment } from "../models/work-assignment";
import { MSREvent } from "../models/msr-event";

export function useSetWorkAssignment(
  onSuccess: () => void,
  event?: MSREvent
): (workAssignment: WorkAssignment) => void {
  const setWorkAssignment = (workAssignment: WorkAssignment) => {
    fetch(`/api/events/${event?.id}/assignments`, {
      method: "POST",
      body: JSON.stringify(workAssignment),
    })
      .then((res) => {
        if (res.ok) {
          onSuccess();
        }
        return Promise.reject(res);
      })
      .catch((error) => console.log(error));
  };

  return setWorkAssignment;
}

export function useUnsetWorkAssignment(
  onSuccess: () => void,
  event?: MSREvent
): (workAssignment: WorkAssignment) => void {
  const unsetWorkAssignment = (workAssignment: WorkAssignment) => {
    fetch(`/api/events/${event?.id}/assignments`, {
      method: "DELETE",
      body: JSON.stringify(workAssignment),
    })
      .then((res) => {
        if (res.ok) {
          onSuccess();
        }
        return Promise.reject(res);
      })
      .catch((error) => console.log(error));
  };

  return unsetWorkAssignment;
}

export function useGetWorkAssignments(event?: MSREvent): WorkAssignment[] {
  const [assignments, setAssignments] = useState<WorkAssignment[]>([]);

  useEffect(() => {
    fetch(`/api/events/${event?.id}/assignments`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        setAssignments(data);
      })
      .catch((error) => console.log(error));
  }, [setAssignments]);

  return assignments;
}
