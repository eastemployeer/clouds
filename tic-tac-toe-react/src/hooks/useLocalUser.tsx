import React, { useCallback, useContext, useEffect, useMemo, useState, createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import axios, { AxiosResponse } from "axios";

interface User {
    id: string;
    email: string;
    wins: number;
    loses: number;
}

export interface LocalUserContextState {
  user: User | null;
  replaceUser: (user: User | null) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResponse>;
}

export const LocalUserContext = createContext<LocalUserContextState | null>(null);

interface LocalUserProviderProps {
  defaultUser?: User | null;
  children: React.ReactNode;
}

interface LoginResponse {
  status: string;
  token: string;
  data: {
    user: User;
  }
}

export function LocalUserProvider({ defaultUser = null, children }: LocalUserProviderProps) {
  const [user, setLocalUser] = useState(defaultUser);
  const login = useCallback(async (email: string, password: string) => {
    const user = await axios<any, AxiosResponse<LoginResponse>>({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/auth/login`,
      data: {
          email,
          password
        }
      });
      setLocalUser(user.data.data.user);
      return user.data;
  }, [])

    const refreshUser = useCallback(async () => {
      // const user = await requestJSON<LocalUserResponse>({
      //   url: '/api/localUser',
      // });
      
      setLocalUser(null);
      
      return user;
    }, [user]);

    const logout = useCallback(async () => {
      // await requestJSON({
      //   url: `/api/auth/logout`,
      //   method: "POST",
      // });
      
      setLocalUser(null);
    }, []);

  const value = useMemo(() => ({ user, replaceUser: setLocalUser, refreshUser, logout, login }), [user, refreshUser, logout, login]);

  return (
    <LocalUserContext.Provider value={value} >
      {children}
    </LocalUserContext.Provider>
  );
}

export default function useLocalUser(required?: true): LocalUserContextState & { user: User };
export default function useLocalUser(required: boolean): LocalUserContextState;
export default function useLocalUser(required = true): LocalUserContextState {
  const navigate = useNavigate();
  const context = useContext(LocalUserContext);
  if(!context) throw new Error("Can't use useLocalUser outside of LocalUser context");
  
  useEffect(() => {
    if(required && !context?.user) {
      toast.warning("You need to sign in or sign up before continuing");
      navigate(`/login`);
    }
  }, [context?.user, navigate, required]);
  
  if(required && !context.user) {
    return {
      ...context,
      user: {
        id: "",
        email: "",
        loses: 0,
        wins: 0
      },
    };
  } else {
    return context;
  }
}
