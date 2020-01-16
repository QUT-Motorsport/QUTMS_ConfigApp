# QUTMS_ConfigApp

![The Plan](/the_plan.png)

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
npm run dev:electron
```

## Editing the Frontend/UI (Typescript & React Development)

All the top-level page components are in `qev2-config/react/pages/`. These page components may also import re-usable React components that are defined in `qev2-config/react/components/`. Open them in your favourite editor (VSCode is recommended). If you have run the app in development mode, editing any of these pages and saving the file (ctrl-s) will cause the development app to restart and show your changes.

## Editing the Backend (Python & Flask Development)

To make changes to the backend, edit the files in `qev2-config/python/`. The main python file is `qev2-config/python/api.py` which contains a Flask server.

## Experimentation via Jupyter Lab

First install jupyter lab (I will provide a conda environment eventually, for now just `pip install jupyterlab`)

Then open the browser-based IDE with:

```
jupyter lab
```

Jupyter-lab makes incremental research and development super easy and intuitive (imo). Widgets are great for incremental data-analysis and visualization. To make one, its easiest develop them in a notebook (`.ipynb` file in the `notebooks` folder) and then move it into its own `.py` file in the `widgets` folder when you are happy with the results, so that it can be used by the React/Flask app as well.

The main 3 widget libraries I would recommend having a look at are:

- [ipywidgets](https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Basics.html) - Buttons, Sliders, Dropdowns, general UI
- [bqplot](https://bqplot.readthedocs.io/en/latest/) - Incredibly interactive 2D plotting library by Bloomberg Financial
- [k3d-jupyter](https://k3d-jupyter.readthedocs.io/en/latest/) - Relatively interactive, beautiful 3D plots in WebGL

## Installing the Electron app permanently

First you need to build the desktop application for the desired operating system:

- Windows 32 Bit: `npm run build:win32`
- Windows 64 Bit: `npm run build:win64` (this is probably the one you want)
- Mac: `npm run build:mac`
- Linux: `npm run build:linux`

Then check the `dist` app for resulting install packages for your desired platform

## Any questions?

If this readme doesn't answer any of your questions, please open an Issue on this GitHub! It will help people in the future find answers to similar questions. I will respond to it as soon as possible and update this Readme as necessary.

Lots-of-Love, Callum Hays
