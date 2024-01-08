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
    bucket: Bucket;
    runGroup: RunGroup;
}

export enum Bucket {
    None = 0,
    Bucket1 = 1,
    Bucket2 = 2,
    Bucket3 = 3,
    Bucket4 = 4,
    Bucket5 = 5,
    Bucket6 = 5,
    Bucket7 = 6,
    Bucket8 = 7
}