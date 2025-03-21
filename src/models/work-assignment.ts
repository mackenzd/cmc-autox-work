import { MSRSegment } from "./msr-segment";
import { MSRUser } from "./msr-user";
import { RunGroup } from "./run-group";

export type WorkAssignment = {
  user?: MSRUser;
  vehicleNumber?: string;
  type: WorkAssignmentType;
  station: Station;
  runGroup: RunGroup;
  segment?: MSRSegment;
};

export enum WorkAssignmentType {
  Computer = "Computer",
  Assistant1 = "Assistant 1",
  Assistant2 = "Assistant 2",
  Grid1 = "Grid 1",
  Grid2 = "Grid 2",
  GateMarshal = "Gate Marshal",
  Instructor1 = "Instructor 1",
  Instructor2 = "Instructor 2",
  Start = "Start",
  Leader = "Leader",
  Runner1 = "Runner 1",
  Runner2 = "Runner 2",
  Runner3 = "Runner 3",
}

export enum Station {
  None = 0,
  Station1 = 1,
  Station2 = 2,
  Station3 = 3,
  Station4 = 4,
  Station5 = 5,
  Station6 = 5,
  Station7 = 7,
  Station8 = 8,
  Station9 = 9,
  Station10 = 10,
  Station11 = 11,
  Station12 = 12,
}
