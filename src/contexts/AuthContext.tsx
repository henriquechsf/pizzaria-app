import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user.name;

  const signIn = async ({ email, password }: SignInProps) => {
    setLoading(true);

    try {
      const response = await api.post("/session", { email, password });

      const { id, name, token } = response.data;

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@userpizzaria", JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({ id, name, email, token });

      setLoading(false);
    } catch (err) {
      console.log("Erro ao logar", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}