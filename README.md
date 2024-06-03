# CNH Staff Management App

## Description

This is the monorepo for the Drexel University senior design project, Staffing For Nurses. The repo was created using the npm [workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) package and contains the source code for the mobile app, admin web app, and server faciliating between the two aforementioned apps.

The projects are located in the following directories: - Web (Admin portal): `apps/web` - Mobile app: `apps/mobile` - Server: `apps/server`

## Installation/Execution

1. If this is the first time starting the project, run `npm i` from root directory of this repository to install all necessary dependencies for the 3 projects
2. Start the mobile app by running the following commands:

   1. `cd apps/mobile`

   2. `npm run android` - to start the app on an Android emulator

   3. `npm run ios` - to start the app on an iOS emulator

**Note**: These commands are ran with the assumption that you have already set up emulators in Android Studio/XCode. If you need any help with this, please refer to **Resources** section of this README.

3. Start the web app by running the following commands:

   1. `cd apps/web`

   2. `npm run dev`

4. Start the server project by running the following commands:

   1. `cd apps/server`

   2. `npm run dev`

## Testing

To run unit tests run the following commands (from the root directory): - `npm run web-tests`: to run tests under the web project - `npm run mobile-tests`: to run tests under the mobile project - `npm run server-tests`: to run tests under the server project

## Development Notes

- When doing work for the mobile app or admin portal, make sure to first start the **server** project before the starting mobile **or** web projects. This will prevent your API calls to the server will failing.
- Before starting the `server` project for the first time, make sure that you create `.env` file in the `apps/server` directory to read all the necessary environment variables to get the server up and running. Look at the section `Example .env file` for more details on what the `.env` file should look like.

## Database

Database connections are handled in the server project upon startup using a series of environment variables that are set in a `.env` file found in the root directory of the server project (`apps/server`).
Environment variables used in database setup are prefixed with the characters "DB".

### Example .env file

```
SERVER_PORT=3003

ENVIRONMENT=dev

JWT_SECRET_KEY="secret_key"

ACCESS_TOKEN_LIFETIME='1hr'

REFRESH_TOKEN_LIFETIME='3d'

DB=cnh_staff_management

DB_USER=admin

DB_PASSWORD=Cnh_nurses24

DB_DIALECT=oracle

DB_CONNECTION_STRING=connection_string
```

**Environment Variables**

- SERVER_PORT: Port number for the server. Useful for running the project locally on a single machine, may be unnecessary once project is moved into CNH infrastructure

- ENVIRONMENT: Environment project is ran in
- JWT_SECRET_KEY: secret used to encrypt JWT tokens
- ACCESS_TOKEN_LIFETIME: lifetime of access token
- REFRESH_TOKEN_LIFETIME: lifetime of refresh token
- DB: name of database used with server
- DB_USER: database username
- DB_PASSWORD: database password
- DB_DIALECT: Flavor of SQL used by the database (Oracle, postgres, mysql, etc.)
- DB_CONNECTION_STRING: Connection string used to connect to database

**NOTE:** more information about how to connect to Sequelize can be found [here](https://sequelize.org/docs/v6/getting-started/)

## Resources

- Setting up mobile emulators
  - [React Native guide to setting up environment (Android & iOS)](https://reactnative.dev/docs/set-up-your-environment)
    - Note: Any iOS emulation must be done on a computer with MacOS installed. XCode (the application that manages the iOS emulators) can't be installed on any other operating system.
  - `npx expo start -c` (run this from `apps/mobile`): Clears cache in Expo before starting application. Similar to running `npm run android` or `npm run ios`.

## Contents of the Deliverable

### Main Features

- Web

  - Login: admin and nurse managers are able to log in/log out

  - Upload timesheets (CSV files)

  - Schedule: Schedules for hospital staff can be viewed on a (day, week, month basis)

  - Shift history: Admins can view all past shift requests

  - Shift requests: admin can accept/deny requests

  - Admin can adjust staff capacities for different shifts

  - Admin and nurse manager users can send messages to nurses

- Server

  - Data management

  - Stores/retrieves data for mobile and web apps
  - Creates db model (using Sequelize)
  - Handles login authentication and authorization
  - File processing
  - Socket management (chat and user notifications)

- Mobile
  - Login: Users can easily log in/log out of app
  - Schedule: users can view what shifts they have assigned to them
  - Shift request: users can request new or changes to shifts
  - Live notifications for updates on shift requests
  - Chat: forum that lets nurses send messages to other users/admins

### Issues & Workarounds

- Sign In
  - Passwords aren't encrypted in db
  - No current mechanism for users to sign up for mobile or web app
  - **Workaround:** Accounts have to manually be added to the `UserInformation` table in the database
- Mobile app persistent login fails sometimes if the server goes down
  - **Workaround:** No current workaround, potential fix would be imnplemeting a refreshUser functionality in the mobile project similar to the functionality found in the web project.
