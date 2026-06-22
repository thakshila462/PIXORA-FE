import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PHOTOGRAPHER" | "CUSTOMER";
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        role:
          parsedUser.role ||
          parsedUser.roles?.[0] ||
          (parsedUser.role === "ADMIN" ? "ADMIN" : "CUSTOMER"),
      });
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData: User, accessToken: string) => {
    const normalizedUser = {
      ...userData,
      role: userData.role || userData.roles?.[0] || "CUSTOMER",
    };
    setUser(normalizedUser);
    setToken(accessToken);
    localStorage.setItem("USER", JSON.stringify(normalizedUser));
    localStorage.setItem("ACCESS_TOKEN", accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};