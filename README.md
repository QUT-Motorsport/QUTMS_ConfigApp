# QUTMS_ConfigApp

## Setup Development Environment

Install all npm dependencies:

```
cd qev2-config && npm i
```

## Run config-app as website in development mode (hot-reloading)

```
npm run dev
```

## Run config-app as electron-app in development mode (cold reloading)

```
npm run dev-electron
```

## Editing the Frontend/UI (Typescript & React Development)

All the top-level page components are in `qev2-config/react/pages/`. These page components may also import re-usable React components that are defined in `qev2-config/react/components/`. Open them in your favourite editor (VSCode is recommended). If you have run the app in development mode, editing any of these pages and saving the file (ctrl-s) will cause the development app to restart and show your changes.

## Editing the Backend/API (Python & Flask Development)

To make changes to the backend, edit the files in `qev2-config/python/`. The main file that is executed by the javascript electron backend is `qev2-config/python/api.py` which contains a Flask server.

**TODO:** At the time of writing, communications between the frontend and backend are performed through the `GraphQL` protocol, which is good for large, long-term projects but is unnecessarily complex for our use-case and skill level. We should tear this up and replace it with the regular Flask RESTful protocol.

## Installing the Electron app permanently

**TODO:** Add respective `build:<platform>` scripts below to `package.json::scripts`, and test (at least) windows installation

First you need to build the desktop application for the desired operating system:

- Windows 32 Bit: `npm run build:win32`
- Windows 64 Bit: `npm run build:win64` (this is probably the one you want)
- Mac: `npm run build:mac`
- Linux: `npm run build:linux`

## Experimentation via Jupyter Lab

First install jupyter lab (I will provide a conda environment eventually, for now just `pip install jupyterlab`)

Then open the browser-based IDE with:

```
jupyter lab
```

Jupyter-lab makes incremental research and development super easy and intuitive (imo). Widgets are great for incremental data-analysis and visualization. To make one, its easiest develop them in a notebook and then move it into its own python file in the `widgets` folder when you are happy with the results, so that it can be used by the React/Flask app as well.

The main 3 widget libraries I would recommend having a look at are:

- (ipywidgets)[https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Basics.html]
- (bqplot)[https://bqplot.readthedocs.io/en/latest/]
- (k3d-jupyter)[https://k3d-jupyter.readthedocs.io/en/latest/]

### Any questions?

If this readme doesn't answer any of your questions, please open an Issue on this GitHub! It will help people in the future find answers to similar questions. I will respond to it as soon as possible and update this Readme as necessary.

- Callum Hays
