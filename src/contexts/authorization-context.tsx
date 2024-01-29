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
  setIsLoading: (isLoading: boolean) => void;
}

export const DefaultContext: Props = {
  user: undefined,
  roles: undefined,
  setUser: setStateDefaultFunction,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  setIsLoading: setStateDefaultFunction,
};

const AuthorizationContext = createContext<Props>(DefaultContext);

export const AuthorizationContextProvider = (props: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useGetUser(() => setIsLoading(false));
  const roles = useGetUserRoles(user);
  const isAdmin = roles?.some((r) => r === Role.Admin);

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
      }}
    >
      {props.children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthorizationContext = (): Props => {
  return React.useContext<Props>(AuthorizationContext);
};
