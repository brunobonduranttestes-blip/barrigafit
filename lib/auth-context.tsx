import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  is_admin: boolean;
  perfil_foto?: string;
  objetivo: string;
  nivel: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, nome: string, codigo_acesso: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("barrigafit:auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to restore token:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, nome: string, codigo_acesso: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
          },
          body: JSON.stringify({
            email,
            password: codigo_acesso,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Fetch user data from usuarios table
      const userResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/usuarios?email=eq.${email}&select=*`,
        {
          headers: {
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const users = await userResponse.json();
      if (users.length === 0) {
        throw new Error("User not found");
      }

      const userData = users[0] as AuthUser;
      setUser(userData);

      await AsyncStorage.setItem("barrigafit:auth_user", JSON.stringify(userData));
      await SecureStore.setItemAsync("barrigafit:access_token", data.access_token);
      await SecureStore.setItemAsync("barrigafit:refresh_token", data.refresh_token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("barrigafit:auth_user");
      await SecureStore.deleteItemAsync("barrigafit:access_token");
      await SecureStore.deleteItemAsync("barrigafit:refresh_token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return;

    try {
      const token = await SecureStore.getItemAsync("barrigafit:access_token");
      const updatedUser = { ...user, ...updates };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/usuarios?id=eq.${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setUser(updatedUser);
      await AsyncStorage.setItem("barrigafit:auth_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
