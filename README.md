#  CNH Staff Management App
## Description
This is the monorepo for the Drexel University senior design project Staffing For Nurses. In this repo contains the source code for the mobile app, admin web site, and server that connects the site and app.
 ## Getting Started
**Note**: The following commands are all meant to be ran from the root directory of this repo (same location as this README)
 1.  Run the following commands to start the mobile app
	 - `npm run android` - to start the app on an Android emulator
	 - `npm run ios` - to start the app on an iOS emulator
	 - **Note**: These commands are ran with the assumption that you have already set up emulation in 	   Android Studio/XCode. If you need any help with this, please refer to this [link](https://reactnative.dev/docs/environment-setup?guide=native).
 2. To run the web app, from the root directory run the following commands:
	 - `cd apps/web`
	 - `npm run start`
 3. To start the server, from the root directory run the following commands:
	- `cd apps/server`
	- `node index.js`
