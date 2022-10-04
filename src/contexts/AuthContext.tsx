import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
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
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      // pegar os dados do user
      const userInfo = await AsyncStorage.getItem("@userpizzaria");
      let hasUser: UserProps = JSON.parse(userInfo || "{}");

      // verifica se recebemos informacoes dele
      if (Object.keys(hasUser).length > 0) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${hasUser.token}`;

        setUser({
          id: hasUser.id,
          name: hasUser.name,
          email: hasUser.email,
          token: hasUser.token,
        });
      }

      setLoading(false);
    }

    getUser();
  }, []);

  const signIn = async ({ email, password }: SignInProps) => {
    setLoadingAuth(true);

    try {
      const response = await api.post("/session", { email, password });

      const { id, name, token } = response.data;

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@userpizzaria", JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({ id, name, email, token });

      setLoadingAuth(false);
    } catch (err) {
      console.log("Erro ao logar", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, loading, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
