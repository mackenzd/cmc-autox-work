import { PropsWithChildren, createContext, useState } from "react";
import React from "react";
import { MSRUser } from "../models/msr-user";
import { useGetUser, useGetUserRoles } from "../hooks/users";
import { Role } from "../models/roles";

const setStateDefaultFunction = () => {
  return;
};

interface Props {
  user?: MSRUser;
  roles?: string[];
  setUser: (user?: MSRUser) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isUnrestricted: boolean;
  isRestricted: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const DefaultContext: Props = {
  user: undefined,
  roles: undefined,
  setUser: setStateDefaultFunction,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  isUnrestricted: false,
  isRestricted: true,
  setIsLoading: setStateDefaultFunction,
};

const AuthorizationContext = createContext<Props>(DefaultContext);

export const AuthorizationContextProvider = (props: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useGetUser(() => setIsLoading(false));
  const roles = useGetUserRoles(user);
  const isAdmin = roles?.some((r) => r === Role.Admin);
  const isUnrestricted = roles?.some((r) => r === Role.Unrestricted);
  const isRestricted = roles?.some((r) => r === Role.Restricted);

  return (
    <AuthorizationContext.Provider
      value={{
        user,
        roles,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        setIsLoading,
        isAdmin,
        isUnrestricted,
        isRestricted
      }}
    >
      {props.children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthorizationContext = (): Props => {
  return React.useContext<Props>(AuthorizationContext);
};
