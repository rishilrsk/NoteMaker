import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import api, { getAuthUser } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("notemaker-token");
    if (token) {
      try {
        const res = await getAuthUser();
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error(
          "Auth Error:",
          err.response ? err.response.data.msg : err.message
        );
        localStorage.removeItem("notemaker-token");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (token) => {
    localStorage.setItem("notemaker-token", token);
    await loadUser();
  };

  /**
   * @desc     Logout user
   */
  // 1. REVERT THIS FUNCTION. Remove the setTimeout.
  const logout = () => {
    localStorage.removeItem("notemaker-token");
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
