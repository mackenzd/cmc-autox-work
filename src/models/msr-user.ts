import { MSRUserOrganization } from "./msr-organization";

export type MSRUser = {
    avatar: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    organizations: MSRUserOrganization[]
}