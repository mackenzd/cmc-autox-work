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
    Runner3 = 'Runner 3',
    Runner4 = 'Runner 4'
}

export type WorkAssignment = {
    user: MSRUser;
    carNumber: string;
    type: WorkAssignmentType;
    bucket: Bucket;
    runGroup: RunGroup;
}

export enum Bucket {
    "None",
    "Bucket 1",
    "Bucket 2",
    "Bucket 3",
    "Bucket 4",
    "Bucket 5",
    "Bucket 6",
    "Bucket 7",
    "Bucket 8"
}