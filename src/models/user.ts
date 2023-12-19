import { UserOrganization } from "./organization";

export type User = {
    avatar: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    organizations: UserOrganization[]
}