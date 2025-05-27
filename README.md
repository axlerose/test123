# Choir Management App

## 1. Project Overview

The Choir Management App is a full-stack application designed to help choirs manage their song repertoire and rehearsal schedules. It features a Spring Boot backend for robust data management and API services, and a React Native frontend for a cross-platform mobile user experience. Authentication and authorization are handled by Keycloak, with PostgreSQL as the database.

**Key Technologies:**

*   **Backend**: Java, Spring Boot (Web, Data JPA, Security/OAuth2 Resource Server)
*   **Frontend**: React Native, TypeScript, React Navigation, Axios
*   **Authentication**: Keycloak
*   **Database**: PostgreSQL
*   **Build Tools**: Maven (Backend), Node/NPM/Yarn (Frontend)
*   **API Documentation**: Springdoc OpenAPI (Swagger UI)

## 2. Features

### User Features:
*   View a list of choir songs (repertoire).
*   View detailed information for each song (lyrics, composer, links to tabs/scores if available).
*   View a calendar or list of upcoming rehearsals.

### Admin Features:
*   **Song Management**: Create, Read, Update, and Delete (CRUD) songs in the repertoire.
*   **Rehearsal Management**: CRUD rehearsals, including setting date/time, location, notes, and managing the list of songs (with specific order) for each rehearsal.
*   Role-based access control for admin functionalities.

## 3. Backend Setup (`my-spring-project/`)

### Prerequisites:
*   Java JDK (version 17 or later recommended)
*   Apache Maven (version 3.6 or later recommended)
*   PostgreSQL (version 12 or later recommended)
*   Keycloak (latest stable version recommended, e.g., 24.x.x) - can be run via Docker or standalone.

### Database Configuration:
1.  Ensure PostgreSQL is installed and running.
2.  Create a database for the application (e.g., `choir_management_db`).
    ```sql
    CREATE DATABASE choir_management_db;
    ```
3.  Create a PostgreSQL user with privileges to connect to and manage this database (e.g., `choir_user`).
    ```sql
    CREATE USER choir_user WITH PASSWORD 'your_strong_password';
    GRANT ALL PRIVILEGES ON DATABASE choir_management_db TO choir_user;
    ```
    *(Note: Adjust privileges as necessary for your security policy.)*

### Keycloak Configuration:
A detailed Keycloak setup is crucial for the application's security.
1.  **Create a Realm**:
    *   Name: e.g., `ChoirAppRealm` (this will be `YOUR_REALM_NAME` in properties).
2.  **Create Backend Client (for Spring Boot API)**:
    *   Client ID: e.g., `choir-backend-client`
    *   Client Protocol: `openid-connect`
    *   Access Type: `bearer-only` (or `confidential` if using client secrets, though bearer-only is typical for resource servers).
    *   Valid Redirect URIs: Not strictly necessary for bearer-only.
    *   Ensure "Service Accounts Enabled" is ON if you plan to use client credentials for any service-to-service communication (not primary for this app's user auth).
3.  **Create Frontend Client (for React Native App)**:
    *   Client ID: e.g., `choir-frontend-client` (this will be `your-react-native-client-id` in frontend config).
    *   Client Protocol: `openid-connect`
    *   Access Type: `public` (as mobile apps cannot securely store secrets).
    *   Valid Redirect URIs: `choirapp://callback`, `choirapp://logout` (these are deep link schemes).
    *   Web Origins: `*` or your app's specific origins if applicable (less relevant for pure native apps but good to be aware of for web-based Keycloak interactions).
    *   Standard Flow Enabled: ON.
    *   Direct Access Grants Enabled: OFF (unless specifically needed, generally less secure).
    *   Implicit Flow Enabled: OFF (use Authorization Code Flow with PKCE).
    *   Authorization Code Flow with PKCE: ON.
4.  **Define Roles**:
    *   Create a realm role named `ADMIN`.
    *   Create a realm role named `USER` (or rely on default roles if sufficient).
5.  **Create Users and Assign Roles**:
    *   Create at least one admin user and assign them the `ADMIN` role.
    *   Create regular users (they might get `USER` role by default or assign explicitly).
6.  **Configure Mappers (Optional but Recommended)**:
    *   Ensure roles are included in the access token. For `realm_access.roles`, this is often default.
    *   If using client-specific roles, ensure mappers are set up for the frontend client to include these roles in the token.

### Application Configuration:
*   Navigate to `my-spring-project/src/main/resources/`.
*   **Rename `application.properties.example` to `application.properties` (if provided) or edit `application.properties` directly.**
*   Update the following properties with your actual Keycloak and PostgreSQL details:
    ```properties
    # Spring Security OAuth2 Resource Server (Keycloak Integration)
    spring.security.oauth2.resourceserver.jwt.issuer-uri=http://YOUR_KEYCLOAK_BASE_URL/realms/YOUR_REALM_NAME
    # spring.security.oauth2.resourceserver.jwt.jwk-set-uri is derived if not set

    # Database Configuration
    spring.datasource.url=jdbc:postgresql://localhost:5432/choir_management_db
    spring.datasource.username=choir_user
    spring.datasource.password=your_strong_password
    spring.jpa.hibernate.ddl-auto=update # Or 'validate'/'none' for production
    ```

### Running the Spring Boot Application:
1.  Open a terminal in the `my-spring-project/` directory.
2.  Run the application using Maven:
    ```bash
    mvn spring-boot:run
    ```
3.  Alternatively, build the JAR and run it:
    ```bash
    mvn clean package
    java -jar target/my-spring-project-0.0.1-SNAPSHOT.jar
    ```
    The application will typically start on `http://localhost:8080`.

### API Documentation:
Once the backend is running, API documentation (Swagger UI) is available at:
`http://localhost:8080/swagger-ui.html`

## 4. Frontend Setup (`ChoirManagementApp/`)

### Prerequisites:
*   Node.js (LTS version, e.g., 18.x or later)
*   npm (comes with Node.js) or Yarn
*   React Native CLI (ensure environment is set up as per React Native official documentation: "Environment Setup")
*   Android Studio (for Android development, emulator, and SDKs)
*   Xcode (for iOS development, simulator - macOS only)

### Steps to Run the App:
1.  **Clone the Repository** (if not already done):
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Navigate to Frontend Directory**:
    ```bash
    cd ChoirManagementApp
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    # OR
    yarn install
    ```
4.  **Configure Keycloak and API Details**:
    *   Open `ChoirManagementApp/src/config/appConfig.ts`.
    *   Update `keycloakConfig` with your Keycloak realm and frontend client details:
        ```typescript
        export const keycloakConfig = {
          authority: 'YOUR_KEYCLOAK_BASE_URL/realms/YOUR_REALM_NAME', // e.g., http://localhost:8088/realms/ChoirAppRealm
          client_id: 'your-react-native-client-id', // e.g., choir-frontend-client
          redirect_uri: 'choirapp://callback',
          post_logout_redirect_uri: 'choirapp://logout',
          // ... other fields are likely fine
        };
        ```
    *   Update `API_BASE_URL` to point to your running Spring Boot backend:
        ```typescript
        export const API_BASE_URL = 'http://your-backend-api-url/api'; 
        // For Android Emulator accessing localhost: http://10.0.2.2:8080/api
        // For iOS Simulator or physical device: http://localhost:8080/api (if backend on same machine)
        // Or your machine's network IP: http://<your-machine-ip>:8080/api
        ```

5.  **Set Up Native Deep Linking (Crucial for Keycloak Redirects)**:
    The scheme `choirapp://` must be configured for both Android and iOS to handle redirects from Keycloak after login/logout.

    *   **Android (`ChoirManagementApp/android/app/src/main/AndroidManifest.xml`)**:
        Add an `<intent-filter>` to the `<activity>` that has `android:launchMode="singleTask"` (usually `MainActivity`):
        ```xml
        <activity
          android:name=".MainActivity"
          android:label="@string/app_name"
          // ... other attributes
          android:launchMode="singleTask"> // Important for deep linking
          <intent-filter>
              <action android:name="android.intent.action.MAIN" />
              <category android:name="android.intent.category.LAUNCHER" />
          </intent-filter>
          <intent-filter android:label="Choir Management App Deep Link">
              <action android:name="android.intent.action.VIEW" />
              <category android:name="android.intent.category.DEFAULT" />
              <category android:name="android.intent.category.BROWSABLE" />
              <data android:scheme="choirapp" android:host="callback" />
              <data android:scheme="choirapp" android:host="logout" />
          </intent-filter>
        </activity>
        ```

    *   **iOS (`ChoirManagementApp/ios/<YourProjectName>/Info.plist`)**:
        Add URL Types entry:
        ```xml
        <key>CFBundleURLTypes</key>
        <array>
          <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLName</key>
            <string>com.example.choirmanagementapp</string> <!-- Or your bundle ID -->
            <key>CFBundleURLSchemes</key>
            <array>
              <string>choirapp</string>
            </array>
          </dict>
        </array>
        ```
    *   **iOS (`ChoirManagementApp/ios/<YourProjectName>/AppDelegate.mm` or `AppDelegate.swift`)**:
        Ensure deep linking methods are implemented. For React Native 0.60+ with autolinking, this is often handled if `react-native-linking` is correctly set up. If manual setup is needed:
        Add to `AppDelegate.mm`:
        ```objectivec
        #import <React/RCTLinkingManager.h>

        // ...

        - (BOOL)application:(UIApplication *)application
           openURL:(NSURL *)url
           options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
        {
          return [RCTLinkingManager application:application openURL:url options:options];
        }

        // For Universal Links (optional here, but good practice)
        - (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
         restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
        {
         return [RCTLinkingManager application:application
                          continueUserActivity:userActivity
                            restorationHandler:restorationHandler];
        }
        ```

6.  **Start Metro Bundler (Optional, but good practice to run in a separate terminal)**:
    ```bash
    npx react-native start
    # OR
    yarn start
    ```
7.  **Run on Android**:
    Make sure an emulator is running or a device is connected.
    ```bash
    npx react-native run-android
    # OR
    yarn android
    ```
8.  **Run on iOS (macOS only)**:
    Make sure a simulator is running or a device is connected.
    ```bash
    npx react-native run-ios
    # OR
    yarn ios
    ```
    You might need to run `cd ios && pod install && cd ..` if you encounter issues with native modules.

## 5. Project Structure

*   `my-spring-project/`: Contains all backend Java Spring Boot code.
    *   `src/main/java/com/example/myspringproject/`: Main source code.
        *   `config/`: Security, OpenAPI configurations.
        *   `controller/`: REST API controllers.
        *   `dto/`: Data Transfer Objects.
        *   `exception/`: Custom exception handlers.
        *   `mapper/`: DTO to Entity mappers.
        *   `model/`: JPA Entities.
        *   `repository/`: Spring Data JPA repositories.
        *   `service/`: Business logic services.
    *   `src/main/resources/`: Application properties, static assets (if any).
    *   `src/test/`: Unit and integration tests for the backend.
*   `ChoirManagementApp/`: Contains all React Native frontend code.
    *   `src/`: Main source code for the mobile app.
        *   `components/`: Reusable UI components.
        *   `config/`: Application configuration (Keycloak, API URL).
        *   `contexts/`: React Context API providers (Auth, Songs, Rehearsals).
        *   `navigation/`: Navigation stacks and tab navigators.
        *   `screens/`: Application screens, including admin screens.
        *   `services/`: API service wrappers (Auth, Songs, Rehearsals).
        *   `types/`: TypeScript type definitions.
    *   `android/`: Android native project files.
    *   `ios/`: iOS native project files.
*   The root directory also contains HTML files (`home.html`, `song_detail.html`, etc.) which served as initial UI mockups or inspiration for the application's design.

## 6. Testing

### Backend (`my-spring-project/`):
To run backend tests, navigate to the `my-spring-project/` directory and execute:
```bash
mvn test
```

### Frontend (`ChoirManagementApp/`):
To run frontend tests, navigate to the `ChoirManagementApp/` directory and execute:
```bash
npm test
# OR
yarn test
```
This will run Jest tests. You can also run `yarn tsc` or `npm run tsc` to perform a TypeScript type check.
