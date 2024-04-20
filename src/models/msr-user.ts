import { MSRUserOrganization } from "./msr-organization";
import { Role } from "./roles";

export type MSRUser = {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  avatar: string;
  organizations: MSRUserOrganization[];
  memberId?: string;
  roles?: Role[];
};
