# QUTMS_ConfigApp

<!-- ![ConfigApp](/wiki/banner.png) -->

## Table of Contents

- [Project Architecture and Release Plan](#architecture-and-release-plan)
- [Development Environment Setup](#dev-env-setup)

  - [Windows Install Bundle](#windows-install-bundle)
  - [Cross-Platform Install Script](#cross-platform-install-script)
  - [Manual Installation](#manual-installation)
  - [Environment Activation](#environment-activation)

- [App Development](#app-development)

  - [As Website](#development-as-website)
  - [As Electron App](#development-as-electron-app)
  - [Editing the Frontend / UI (Typescript & React)](#editing-frontend)
  - [Editing the Backend (Python & Sanic WebServer)](#editing-backend)

- [Building Production App](#building-production)
- [Want to Get Involved?](#getting-involved)

<a name="architecture-and-release-plan"></a>

## Project Architecture and Release Plan

Being reworked

<a name="dev-env-setup"></a>

## Official Development Environment

Docker

## Local Development Environment

Conda, vscode, npm start

<a name="app-development"></a>

## App Development

<a name="development-as-website"></a>

Download Docker Desktop (windows & mac) or on linux Docker and Docker-compose.

Run the docker-compose.yml file at repository root to install the bundled services/containers.

```bash
docker-compose up
```

<a name="editing-frontend"></a>

### Editing the Frontend / UI (Typescript & React)

All react/frontend components can be found in /src following create-react-app file format.

When writing your React components, please stick to functional components!
Using pure functional components with hooks is the new and best way to write react components since 2019. Please check [this guide](https://www.valentinog.com/blog/hooks/) to understand how to implement traditional class components as functional components.

<a name="editing-backend"></a>

### Editing the Backend (Python & Quart WebServer)

The webserver is run through main.py through the quart syntax which is an asynchronous webserver framework based heavily on flask. All backend/python work can be found in the backend folder of the project. The responsibility of the backend is to process data, connect the frontend to the database, etc.

<a name="building-production"></a>

Docker

<a name="getting-involved"></a>

## Want to Get Involved?

Studying at QUT? Contact us at qutmotorsport.team@gmail.com or [visit our website](https://www.qutmotorsport.com/) for details on how you can get involved.

# Create React App info

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).