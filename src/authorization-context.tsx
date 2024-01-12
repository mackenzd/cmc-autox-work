import { PropsWithChildren, createContext, useState } from "react";
import React from "react";
import { MSRUser } from "./models/msr-user";
import { useGetUser } from "./hooks/user";

const setStateDefaultFunction = () => {
  return;
};

interface Props {
  user?: MSRUser;
  setUser: (user?: MSRUser) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const DefaultContext: Props = {
  user: undefined,
  setUser: setStateDefaultFunction,
  isAuthenticated: false,
  isLoading: true,
  setIsLoading: setStateDefaultFunction,
};

const AuthorizationContext = createContext<Props>(DefaultContext);

export const AuthorizationContextProvider = (props: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useGetUser(() => setIsLoading(false));

  return (
    <AuthorizationContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        setIsLoading,
      }}
    >
      {props.children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthorizationContext = (): Props => {
  return React.useContext<Props>(AuthorizationContext);
};