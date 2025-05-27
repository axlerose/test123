// src/services/authService.ts
import { UserManager, User, UserManagerSettings } from 'oidc-client-ts';
import { keycloakConfig } from '../config/appConfig';
import * as WebBrowser from 'expo-web-browser'; // For opening the browser
import * as SecureStore from 'expo-secure-store'; // For userStore

// Polyfill for URL if running in an environment where it's not standard (older RN versions)
// import 'react-native-url-polyfill/auto'; // Might be needed

// Custom UserStore using Expo SecureStore (Simplified example)
// oidc-client-ts expects a class implementing `UserStore`
// This is a very basic example; a more robust one would handle all methods of UserStore.
class ExpoSecureStoreUserStore {
    async get(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error("ExpoSecureStoreUserStore.get error", error);
            return null;
        }
    }
    async set(key: string, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error("ExpoSecureStoreUserStore.set error", error);
        }
    }
    async remove(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error("ExpoSecureStoreUserStore.remove error", error);
        }
    }
    // Implement other methods like getAllKeys if oidc-client-ts requires more comprehensive storage interaction
    // For instance, oidc-client-ts might use other methods not covered by this basic example.
    // A more complete implementation might be needed for full compatibility.
    // async getAllKeys(): Promise<string[]> {
    //   console.warn("ExpoSecureStoreUserStore.getAllKeys not implemented");
    //   return []; 
    // }
}


const userManagerSettings: UserManagerSettings = {
    authority: keycloakConfig.authority,
    client_id: keycloakConfig.client_id,
    redirect_uri: keycloakConfig.redirect_uri,
    post_logout_redirect_uri: keycloakConfig.post_logout_redirect_uri,
    response_type: keycloakConfig.response_type,
    scope: keycloakConfig.scope,
    automaticSilentRenew: keycloakConfig.automaticSilentRenew,
    loadUserInfo: keycloakConfig.loadUserInfo,
    // Crucial for React Native: Use a custom state store and potentially user store
    userStore: new ExpoSecureStoreUserStore() as any, // 'as any' to simplify type matching for this example
    stateStore: new ExpoSecureStoreUserStore() as any, // 'as any'
    // metadataSeed: { token_endpoint_auth_methods_supported: ['client_secret_post'] } // If needed
};

const userManager = new UserManager(userManagerSettings);

export const AuthService = {
  userManager, // Expose for advanced use if needed

  login: async (): Promise<void> => {
    console.log('AuthService: Initiating login...');
    try {
        const signinRequest = await userManager.createSigninRequest();
        const browserResult = await WebBrowser.openAuthSessionAsync(signinRequest.url, keycloakConfig.redirect_uri);
        
        if (browserResult.type === 'success' && browserResult.url) {
            console.log('AuthService: Browser login success, URL:', browserResult.url);
            // Actual handling of the URL is done by the deep link listener in AuthContext
            // which calls handleCallback.
        } else {
            console.log('AuthService: Browser login flow cancelled or failed', browserResult);
        }
    } catch (error) {
        console.error('AuthService: Login error', error);
    }
  },

  handleCallback: async (url?: string): Promise<User | null> => {
    console.log('AuthService: Handling callback with URL:', url || (typeof window !== 'undefined' ? window.location.href : 'URL_NOT_AVAILABLE_IN_RN_CONTEXT'));
    if (!url) {
        console.error("AuthService: handleCallback called without a URL.");
        return null;
    }
    try {
        const user = await userManager.signinRedirectCallback(url);
        console.log('AuthService: User signed in', user);
        return user;
    } catch (error) {
        console.error('AuthService: Signin callback error', error);
        return null;
    }
  },

  logout: async (): Promise<void> => {
    console.log('AuthService: Initiating logout...');
    try {
        const user = await userManager.getUser();
        if (user) {
            const signoutRequest = await userManager.createSignoutRequest({ id_token_hint: user.id_token });
            await WebBrowser.openAuthSessionAsync(signoutRequest.url, keycloakConfig.post_logout_redirect_uri);
            await userManager.removeUser(); // Clear user from manager after redirecting
        } else {
             await userManager.removeUser(); 
        }
        console.log('AuthService: Logout process initiated.');
    } catch (error) {
        console.error('AuthService: Logout error', error);
    }
  },

  getUser: async (): Promise<User | null> => {
    return userManager.getUser();
  },

  isAuthenticated: async (): Promise<boolean> => {
    const user = await userManager.getUser();
    return !!user && !user.expired;
  },

  getAccessToken: async (): Promise<string | null> => {
    const user = await userManager.getUser();
    return user?.access_token || null;
  },

  setOnUserLoaded: (callback: (user: User | null) => void) => {
    userManager.events.addUserLoaded(callback as any);
  },
  removeOnUserLoaded: (callback: (user: User | null) => void) => {
    userManager.events.removeUserLoaded(callback as any);
  },
  setOnUserUnloaded: (callback: () => void) => {
    userManager.events.addUserUnloaded(callback);
  },
  removeOnUserUnloaded: (callback: () => void) => {
    userManager.events.removeUserUnloaded(callback);
  },
};
