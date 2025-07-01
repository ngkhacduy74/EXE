import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  getCurrentUser,
  validateToken,
  logout,
} from "../Services/auth.service";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateAndSetUser = async () => {
      try {
        setLoading(true);
        
        // First, try to get user from localStorage for immediate display
        const cachedUser = getCurrentUser();
        if (cachedUser) {
          setUser(cachedUser);
          setLoading(false);
        }
        
        // Then validate token in background
        const { isValid, user: validatedUser } = await validateToken();
        console.log("useAuth - validateToken result:", {
          isValid,
          validatedUser,
        });
        
        if (isValid && validatedUser) {
          setUser(validatedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("useAuth - validateToken error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAndSetUser();
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
  };

  const refreshUser = async () => {
    try {
      const { isValid, user: validatedUser } = await validateToken();
      if (isValid && validatedUser) {
        setUser(validatedUser);
        return true;
      } else {
        handleLogout();
        return false;
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      handleLogout();
      return false;
    }
  };

  return {
    user,
    loading,
    isLoggingOut,
    handleLogout,
    refreshUser,
    isAuthenticated: !!user,
  };
};
