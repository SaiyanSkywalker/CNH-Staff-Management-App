
# CNH Staff Management App

  

## Description

  

This is the monorepo for the Drexel University senior design project Staffing For Nurses. The repo was created using the npm [workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) package and contains the source code for the mobile app, admin web app, and server faciliating between the two aforementioned apps.

  

## Getting Started

  

1. Start the mobile app by running the following commands:


- `cd apps/mobile`

-  `npm run android` - to start the app on an Android emulator

-  `npm run ios` - to start the app on an iOS emulator

  

**Note**: These commands are ran with the assumption that you have already set up emulation in Android Studio/XCode. If you need any help with this, please refer to this [link](https://reactnative.dev/docs/environment-setup?guide=native).

  

2. Start the web app by running the following commands:

  

-  `cd apps/web`

  

-  `npm run dev`

  

3. Start the server by running the following commands:

  

-  `cd apps/server`

  

-  `npm run dev`

  
  

## Development Notes
When doing work for the mobile app or admin portal, make sure to first start the server project before the starting mobile or web projects. This prevents your calls to the server from failing and that you'll always be connected to the database.
