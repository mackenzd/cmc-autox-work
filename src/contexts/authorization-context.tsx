import { PropsWithChildren, createContext, useEffect, useState } from "react";
import React from "react";
import { MSRUser } from "../models/msr-user";
import { useGetCurrentUser, useGetCurrentUserRoles } from "../hooks/users";
import { Role } from "../models/roles";

interface Props {
  user?: MSRUser;
  roles?: string[];
  setUser: (user?: MSRUser) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isUnrestricted: boolean;
  isRestricted: boolean;
  canPreregister: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const setStateDefaultFunction = () => {
  return;
};

export const DefaultContext: Props = {
  user: undefined,
  roles: undefined,
  setUser: setStateDefaultFunction,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  isUnrestricted: false,
  isRestricted: true,
  canPreregister: false,
  setIsLoading: setStateDefaultFunction,
};

const AuthorizationContext = createContext<Props>(DefaultContext);

export const AuthorizationContextProvider = (props: PropsWithChildren) => {
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isRolesLoading, setIsRolesLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [user, setUser] = useGetCurrentUser(() => setIsUserLoading(false));
  const roles = useGetCurrentUserRoles(() => setIsRolesLoading(false));

  useEffect(() => {
    if (!isUserLoading && !isRolesLoading) {
      setIsLoading(false);
    }
  }, [isUserLoading, isRolesLoading]);

  const isAdmin = roles?.some((r) => r === Role.Admin);
  const isUnrestricted = roles?.some((r) => r === Role.Unrestricted);
  const isRestricted = roles?.some((r) => r === Role.Restricted);
  const canPreregister = roles?.some((r) => r === Role.Preregistration);

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
        isRestricted,
        canPreregister,
      }}
    >
      {props.children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthorizationContext = (): Props => {
  return React.useContext<Props>(AuthorizationContext);
};
