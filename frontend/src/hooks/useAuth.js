import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, validateToken, logout } from '../Services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log('useAuth - checkAuthentication started');
      console.log('useAuth - isLoggingOut:', isLoggingOut);
      
      if (isLoggingOut) {
        console.log('useAuth - isLoggingOut is true, skipping auth check');
        setLoading(false);
        return;
      }

      try {
        // Check if user is authenticated
        const isAuth = isAuthenticated();
        console.log('useAuth - isAuthenticated():', isAuth);
        
        if (!isAuth) {
          console.log('useAuth - not authenticated, setting loading to false');
          setLoading(false);
          // Don't redirect immediately, let the component handle it
          return;
        }

        // Get user data from localStorage
        const currentUser = getCurrentUser();
        console.log('useAuth - getCurrentUser():', currentUser);
        
        if (!currentUser) {
          console.log('useAuth - no current user, setting loading to false');
          setLoading(false);
          // Don't redirect immediately, let the component handle it
          return;
        }

        // Validate token with server
        console.log('useAuth - validating token...');
        try {
          const { isValid, user: validatedUser } = await validateToken();
          console.log('useAuth - validateToken result:', { isValid, validatedUser });
          
          if (isValid && validatedUser) {
            console.log('useAuth - token valid, setting user:', validatedUser);
            setUser(validatedUser);
          } else {
            console.log('useAuth - token invalid, but keeping user from localStorage');
            // Token invalid but keep user from localStorage for now
            setUser(currentUser);
          }
        } catch (error) {
          console.log('useAuth - validateToken error, but keeping user from localStorage:', error);
          // API error but keep user from localStorage for now
          setUser(currentUser);
        }
      } catch (error) {
        console.error("useAuth - Authentication check failed:", error);
        // Don't redirect on error, just set loading to false
        setUser(null);
      } finally {
        console.log('useAuth - setting loading to false');
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [isLoggingOut]);

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