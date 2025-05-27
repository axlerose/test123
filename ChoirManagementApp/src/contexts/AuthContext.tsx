// src/contexts/AuthContext.tsx (Relevant parts updated)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'oidc-client-ts';
import { AuthService } from '../services/authService';
import { Linking } from 'react-native';
import { keycloakConfig } from '../config/appConfig'; // For redirect_uri check

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  roles: string[]; // Added
  isAdmin: boolean;  // Added
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const processUser = (currentUser: User | null) => {
    setUser(currentUser);
    const authenticated = !!currentUser && !currentUser.expired;
    setIsAuthenticated(authenticated);

    if (authenticated && currentUser?.profile) {
      // Keycloak typically stores realm roles in user.profile.realm_access.roles
      const realmAccess = (currentUser.profile as any).realm_access;
      const currentRoles = realmAccess?.roles || [];
      setRoles(currentRoles);
      setIsAdmin(currentRoles.includes('ADMIN')); // Check if 'ADMIN' role is present
    } else {
      setRoles([]);
      setIsAdmin(false);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await AuthService.getUser();
        processUser(currentUser);
      } catch (e) {
        console.error("AuthContext: Error loading user", e);
        processUser(null); // Ensure state is cleared on error
      }
    };
    loadUser();

    const userLoadedCallback = (loadedUser: User | null) => processUser(loadedUser);
    const userUnloadedCallback = () => processUser(null);

    AuthService.setOnUserLoaded(userLoadedCallback);
    AuthService.setOnUserUnloaded(userUnloadedCallback);
    
    const handleDeepLink = (event: { url: string }) => {
        console.log('AuthContext: Deep link received:', event.url);
        if (event.url.startsWith(keycloakConfig.redirect_uri)) { // Use imported keycloakConfig
            AuthService.handleCallback(event.url).then(callbackUser => {
                processUser(callbackUser); // Process user after callback
            }).catch(e => {
                console.error("Deep link callback error", e);
                processUser(null);
            });
        }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
        if (url && url.startsWith(keycloakConfig.redirect_uri)) { // Use imported keycloakConfig
            console.log('AuthContext: Initial URL is a redirect:', url);
            AuthService.handleCallback(url).then(initialUser => {
                processUser(initialUser);
            }).catch(e => {
                console.error("Initial URL callback error", e);
                processUser(null);
            });
        }
    });

    return () => {
      AuthService.removeOnUserLoaded(userLoadedCallback);
      AuthService.removeOnUserUnloaded(userUnloadedCallback);
      subscription.remove();
    };
  }, []);

  const login = async () => { 
    setIsLoading(true); 
    await AuthService.login();
    // User state will be updated by deep link handler and userLoaded event
  };
  const logout = async () => {  
    await AuthService.logout(); 
    processUser(null); // Explicitly clear state, though event should also fire
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, roles, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { 
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
