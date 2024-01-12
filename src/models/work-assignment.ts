import { MSRSegment } from "./msr-segment";
import { MSRUser } from "./msr-user";
import { RunGroup } from "./run-group";

export enum WorkAssignmentType {
    Computer = 'Computer',
    Assistant = 'Assistant',
    Grid1 = 'Grid 1',
    Grid2 = 'Grid 2',
    GateMarshal = 'Gate Marshal',
    Instructor1 = 'Instructor 1',
    Instructor2 = 'Instructor 2',
    Instructor3 = 'Instructor 3',
    Instructor4 = 'Instructor 4',
    Start = 'Start',
    Leader = 'Leader',
    Runner1 = 'Runner 1',
    Runner2 = 'Runner 2',
    Runner3 = 'Runner 3'
}

export type WorkAssignment = {
    user: MSRUser | undefined;
    vehicleNumber: string | undefined;
    type: WorkAssignmentType;
    station: Station;
    runGroup: RunGroup;
    segment?: MSRSegment;
}

export enum Station {
    None = 0,
    Station1 = 1,
    Station2 = 2,
    Station3 = 3,
    Station4 = 4,
    Station5 = 5,
    Station6 = 5,
    Station7 = 6,
    Station8 = 7
}