import { MSRUserOrganization } from "./msr-organization";

export type MSRUser = {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  avatar: string;
  organizations: MSRUserOrganization[];
  memberId?: string;
};
