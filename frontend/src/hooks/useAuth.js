import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, validateToken, logout } from '../Services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateAndSetUser = async () => {
      try {
        setLoading(true);
        const { isValid, user: validatedUser } = await validateToken();
        
        if (isValid && validatedUser) {
          setUser(validatedUser);
        } else {
          // If token is invalid, try to keep user from localStorage for better UX
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (error) {
              console.error('useAuth - error parsing stored user:', error);
            }
          }
        }
      } catch (error) {
        console.error('useAuth - validateToken error:', error);
        // Try to keep user from localStorage even if validation fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (parseError) {
            console.error('useAuth - error parsing stored user:', parseError);
          }
        }
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
    isAuthenticated: !!user
  };
}; 