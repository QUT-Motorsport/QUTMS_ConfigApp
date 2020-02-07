# QUTMS_ConfigApp

![QUTMS_Banner](https://raw.githubusercontent.com/Technosasquach/QUTMS_Master/master/src/qutmsBanner.jpg)

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

![Architecture Diagram](/wiki/the_plan.png)

<a name="dev-env-setup"></a>

## Development Environment Setup

First you will want to have 3 things installed.

- [git](https://git-scm.com/download)
- [vscode](https://code.visualstudio.com/) (recommended)
- and [conda](https://docs.conda.io/en/latest/miniconda.html) (if installing on windows, selecting `ADD TO PATH (not recommended)`
  during the installation is actually recommended by us. Although it can cause issues, it makes everything else easier.)

![example of installers folder on H drive](/wiki/qut_tips_installers.PNG)

Notice the `qev3-config-app.tar.gz` in that folder? Installation can take a while,
so we provide a method to cache project installs on the network drive (`H:\`),
and load them back onto the session drive (`C:\`) where your fresh conda install resides. This lets you skip the most lengthy parts
of the installation after the first install on QUT's computers, and still gives you a fast conda environment to work with.

So if you are using the uni computers I recommend providing a cache path to the installer. This will create the file if it doesn't exist, or use it and update it with any dependency changes if it does:

```bash
python install_dev.py --cache-env=H:\qev3-config-app.tar.gz
```

<a name="windows-install-bundle"></a>

### Windows Install bundle

If you are using the university computers to develop, we recommend saving the installers for these programs on your network `H:\` drive
so that you can quickly install them between sessions like so:

<a name="cross-platform-install-script"></a>

### Cross-Platform Install Script

```bash
python install_dev.py
```

<a name="manual-installation"></a>

### Manual Installation

If you don't trust us to install the dev environment for you, or something goes wrong, you can do it manually.

The first step is to install the conda environment from the `environment.yml`:

```
conda env update -f environment.yml
```

The second step is to install the npm packages for the app itself:

```
conda activate qev3-config-app
cd config-app
npm i
```

<a name="environment-activation"></a>

### Environment Activation

_*THIS MUST BE DONE BEFORE RUNNING ANY OTHER COMMAND RELATED TO THE CONFIG APP IN THE TERMINAL, EVERY TIME YOU OPEN A NEW TERMINAL*_

```bash
conda activate qev3-config-app
```

Or, if you are using vscode as we recommend, this repository includes vscode settings that do this automatically. But you have to select to 'Allow' the option in the bottom-right popup box when you first open a terminal (be quick, it disappears):

![allow_shell_injection_vscode](/wiki/allow_shell_injection.png)

You have to then open up a new terminal for the auto-activation t take effect.

<a name="app-development"></a>

## App Development

<a name="development-as-website"></a>

### As website

```bash
# in the `config-app` directory
npm run dev
```

This is recommended over electron-app as it includes hot-module-reloading

<a name="development-as-electron-app"></a>

### As electron app

```bash
# in the `config-app` directory
npm run dev:electron
```

<a name="editing-frontend"></a>

### Editing the Frontend / UI (Typescript & React)

All the top-level page components are in `config-app/react/pages/`. These page components may also import re-usable React components that are defined in `config-app/react/components/`.

Open them in your favourite editor (VSCode is recommended). If you have run the app in development mode, editing any of these pages and saving the file (ctrl-s) will cause the development app to restart and show your changes. Hot-reloading is currently pretty slow and we're working to fix that.

When writing your React components, please stick to functional components!
Using pure functional components with hooks is the new and best way to write react components since 2019. Please check [this guide](https://www.valentinog.com/blog/hooks/) to understand how to implement traditional class components as functional components.

<a name="editing-backend"></a>

### Editing the Backend (Python & Sanic WebServer)

To make changes to the backend, edit the files in `config-app/python/`. The main python file is `config-app/python/api.py` which contains a Sanic server.

<a name="building-production"></a>

## Installing the Electron app permanently

First you need to build the desktop application for the desired operating system:

- Windows 32 Bit: `npm run build:win32`
- Windows 64 Bit: `npm run build:win64` (this is probably the one you want)
- Mac: `npm run build:mac`
- Linux: `npm run build:linux`

Then check the `dist` folder for resulting install packages for your desired platform

<a name="getting-involved"></a>

## Want to Get Involved?

Studying at QUT? Contact us at qutmotorsport.team@gmail.com or [visit our website](https://www.qutmotorsport.com/) for details on how you can get involved.
