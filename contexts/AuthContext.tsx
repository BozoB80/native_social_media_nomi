import { Tables } from "@/helpers/types";
import { createContext, useState, ReactNode, useContext } from "react";

interface AuthContextType {
  user: Tables<"users"> | null;
  setAuth: (authUser: any) => void;
  setUserData: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setAuth: () => {},
  setUserData: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);

  const setAuth = (authUser: any) => {
    setUser(authUser);
  };

  const setUserData = (userData: any) => {
    setUser({ ...userData });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setAuth,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
