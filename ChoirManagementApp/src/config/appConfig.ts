// src/config/appConfig.ts
export const keycloakConfig = {
  authority: 'YOUR_KEYCLOAK_BASE_URL/realms/YOUR_REALM_NAME', // Changed from 'issuer' to 'authority' for oidc-client-ts
  client_id: 'your-react-native-client-id',
  redirect_uri: 'choirapp://callback',
  post_logout_redirect_uri: 'choirapp://logout',
  response_type: 'code', // PKCE flow
  scope: 'openid profile email offline_access', // offline_access for refresh tokens
  // For automatic silent renew
  automaticSilentRenew: true,
  // For PKCE
  loadUserInfo: true, // Typically true
};

export const API_BASE_URL = 'http://your-backend-api-url/api'; // e.g., http://10.0.2.2:8080/api for Android emulator
