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

## Running with Docker

This project can be run using Docker and Docker Compose for a streamlined development and testing environment. This setup includes the backend API, PostgreSQL databases for the application and Keycloak, Keycloak itself, and the React Native Metro bundler.

### Prerequisites

*   [Docker](https://docs.docker.com/get-docker/) installed and running.
*   [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Initial Setup & Configuration

Before launching the Docker stack, some configuration is necessary:

1.  **Passwords (Important!):**
    *   Open `docker-compose.yml`.
    *   Change the placeholder passwords for `POSTGRES_PASSWORD` (for both `postgres` and `keycloak_db` services) and `KEYCLOAK_ADMIN_PASSWORD` (for the `keycloak` service) to strong, unique passwords.

2.  **Keycloak Setup (Manual - First Time):**
    *   Once Keycloak is running (after `docker-compose up`), you'll need to access its admin console (typically `http://localhost:8180`) using the admin credentials you set in `docker-compose.yml`.
    *   Create a new realm (e.g., `choir_realm` or any name you prefer).
    *   **Backend Client:** Inside your realm, create a Keycloak client for the backend service.
        *   **Client ID:** e.g., `choir-backend-service`
        *   **Client Protocol:** `openid-connect`
        *   **Access Type:** `bearer-only` (or `confidential` if using client secret)
    *   **Frontend Client:** Inside your realm, create another Keycloak client for the React Native frontend.
        *   **Client ID:** e.g., `choir-frontend-app`
        *   **Client Protocol:** `openid-connect`
        *   **Access Type:** `public`
        *   **Valid Redirect URIs:** Add `choirapp://callback` and `choirapp://logout` (and any other schemes/hosts you might use for development, like Expo Go specific ones).
        *   **Web Origins:** Add `*` or specific origins if needed for CORS from browser-based interactions (though for React Native, deep linking is key).
    *   **Roles:** Create an `ADMIN` realm role if you haven't already (as per backend setup). Assign this role to your admin user(s).

3.  **Update Configuration Files:**
    *   **`docker-compose.yml` (for Backend Service):**
        *   In the `environment` section of the `backend` service, update `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI`. Replace `YOUR_REALM_NAME` with the actual name of the realm you created in Keycloak. It should look like: `http://keycloak:8180/realms/your_choir_realm_name`. (The `keycloak:8180` part uses Docker's internal network to allow the backend container to find the Keycloak container).
    *   **`ChoirManagementApp/src/config/appConfig.ts` (for React Native Frontend):**
        *   Update the `keycloakConfig`:
            *   `authority`: Set to `http://localhost:8180/realms/your_choir_realm_name` (assuming you access Keycloak from your host machine/emulator via `localhost:8180`. If your emulator/device uses a different IP to access the host, adjust accordingly).
            *   `client_id`: Set to the Client ID you configured for the frontend app in Keycloak (e.g., `choir-frontend-app`).
        *   Update `API_BASE_URL`:
            *   If running an Android emulator, this is typically `http://10.0.2.2:8080/api` (as `10.0.2.2` is the emulator's alias for your host machine's localhost).
            *   If running on a physical device or an emulator that uses your host's network IP, use `http://<your_host_ip>:8080/api`.
            *   If testing on an iOS simulator, `http://localhost:8080/api` should work directly.

### Running the Application Stack

1.  **Build and Start Services:**
    Open a terminal in the root directory of the project (where `docker-compose.yml` is located) and run:
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: Forces Docker Compose to build the images from your Dockerfiles (e.g., for `backend` and `frontend`) before starting the services.
    *   `-d`: Runs the services in detached mode (in the background).

2.  **View Logs:**
    To view logs from all services:
    ```bash
    docker-compose logs -f
    ```
    To view logs for a specific service (e.g., `backend`):
    ```bash
    docker-compose logs -f backend
    ```

3.  **Stopping the Stack:**
    To stop all running services:
    ```bash
    docker-compose down
    ```
    Add `-v` if you also want to remove the named volumes (PostgreSQL data, Keycloak data - **use with caution as this deletes data**):
    ```bash
    docker-compose down -v
    ```

### Accessing Services

Once the stack is running:

*   **PostgreSQL (Application Database):** Accessible on `localhost:5432` (or your mapped port).
*   **PostgreSQL (Keycloak Database):** Accessible on `localhost:5431` (or your mapped port).
*   **Keycloak Admin Console:** `http://localhost:8180` (use the admin credentials set in `docker-compose.yml`).
*   **Backend API:** `http://localhost:8080`
*   **Backend API Documentation (Swagger UI):** `http://localhost:8080/swagger-ui.html`
*   **Frontend Metro Bundler:** `http://localhost:8081` (and other Expo-related ports like 19000, 19001, 19002).

### Connecting the React Native App (Emulator/Device)

Your React Native application (running on an emulator or physical device) needs to connect to the services running in Docker:

1.  **Metro Bundler:**
    *   Ensure your device/emulator is on the same network as your host machine if using a physical device.
    *   The Metro bundler runs on `localhost:8081` *on your host machine*.
    *   **Android Emulator (standard):** Typically, you can access your host's `localhost` via the IP `10.0.2.2` from within the emulator. So, the bundler might be accessible at `10.0.2.2:8081`.
    *   **iOS Simulator:** `localhost:8081` should work directly.
    *   **Physical Device / Other Emulators:** You'll need to use your host machine's actual IP address on your local network (e.g., `192.168.1.100:8081`). You might need to configure the React Native development settings in your app to point to this IP if it doesn't discover it automatically.
    *   The `frontend` service in `docker-compose.yml` maps port 8081, so it's accessible from the host.

2.  **Backend API & Keycloak:**
    *   As configured in `ChoirManagementApp/src/config/appConfig.ts`:
        *   `API_BASE_URL` should point to your backend (e.g., `http://10.0.2.2:8080/api` for Android emulator, or `http://<your_host_ip>:8080/api` for physical devices).
        *   `keycloakConfig.authority` should point to your Keycloak instance (e.g., `http://10.0.2.2:8180/realms/your_realm_name` or `http://<your_host_ip>:8180/realms/your_realm_name`).

3.  **Deep Linking for Keycloak:**
    *   **Crucial:** Ensure you have correctly configured native deep linking for the scheme `choirapp://` (or whatever you set in `appConfig.ts` and Keycloak client settings) in your Android (`AndroidManifest.xml`) and iOS (`Info.plist` / AppDelegate) projects. This is essential for Keycloak to redirect back to your app after login/logout. Refer to React Navigation and Keycloak documentation for platform-specific deep linking setup.

### Data Persistence

*   PostgreSQL data for both the application and Keycloak is persisted in Docker named volumes (`postgres_data` and `keycloak_postgres_data`). This means your data will remain even if you stop and restart the containers with `docker-compose down` and `docker-compose up`.
*   To clear all data, you would use `docker-compose down -v`.
