# QUTMS_ConfigApp

![QUTMS_Banner](https://raw.githubusercontent.com/Technosasquach/QUTMS_Master/master/src/qutmsBanner.jpg)

## Setup Development Environment

First you will want to have 3 things installed.

- [git](https://git-scm.com/download)
- [vscode](https://code.visualstudio.com/)
- and [conda](https://docs.conda.io/en/latest/miniconda.html) (if installing on windows, selecting `ADD TO PATH (not recommended)`
  during the installation is actually recommended by us. Although it can cause issues, it makes everything else easier.)

If you are using the university computers to develop, we recommend saving the installers for these programs on your network `H:\` drive
so that you can quickly install them between sessions like so:

![example of installers folder on H drive](/wiki/qut_tips_installers.PNG)

Notice the `qev3-config-app.tar.gz` in that folder? Installation can take a while,
so we provide a method to cache project installs on the network drive (`H:\`),
and load them back onto the session drive (`C:\`) where your fresh conda install resides. This lets you skip the most lengthy parts
of the installation after the first install on QUT's computers, and still gives you a fast conda environment to work with.

So if you are using the uni computers I recommend providing a cache path to the installer. This will create the file if it doesn't exist, or use it and update it with any dependency changes if it does:

```bash
python install_dev.py --cache-env=H:\qev3-config-app.tar.gz
```

If you're installing to a personal computer, the cache can be ommitted:

```bash
python install_dev.py
```

### Activate Conda Environment

**_THIS MUST BE DONE BEFORE RUNNING ANY OTHER COMMAND RELATED TO THE CONFIG APP IN THE TERMINAL, EVERY TIME YOU OPEN A NEW TERMINAL_**

```bash
conda activate qev3-config-app
```

Or, if you are using vscode as we recommend, this repository has vscode settings that do this automatically. But you have to select to 'Allow' the option in the bottom-right popup box when you first open a terminal (be quick, it disappears):

![allow_shell_injection_vscode](/wiki/allow_shell_injection.png)

## Run config-app as website in development mode (hot-reloading)

```bash
# in the `config-app` directory
npm run dev
```

## Run config-app as electron-app in development mode (cold reloading)

```bash
# in the `config-app` directory
npm run dev:electron
```

## Editing the Frontend/UI (Typescript & React Development)

All the top-level page components are in `qev2-config/react/pages/`. These page components may also import re-usable React components that are defined in `qev2-config/react/components/`. Open them in your favourite editor (VSCode is recommended). If you have run the app in development mode, editing any of these pages and saving the file (ctrl-s) will cause the development app to restart and show your changes.

## Editing the Backend (Python & Flask Development)

To make changes to the backend, edit the files in `qev2-config/python/`. The main python file is `qev2-config/python/api.py` which contains a Sanic server.

## Experimentation via Jupyter Lab

Then open the browser-based IDE with:

```bash
jupyter lab notebooks
```

Jupyter-lab makes incremental research and development super easy and intuitive (imo). Widgets are great for incremental data-analysis and visualization. To make one, its easiest develop them in a notebook (`.ipynb` file in the `notebooks` folder) and then move it into its own `.py` file in the `widgets` folder when you are happy with the results, so that it can be used by the React/Flask app as well.

The main 3 widget libraries I would recommend having a look at are:

- [ipywidgets](https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Basics.html) - Buttons, Sliders, Dropdowns, general UI
- [bqplot](https://bqplot.readthedocs.io/en/latest/) - Incredibly interactive 2D plotting library by Bloomberg Financial
- [plotly](https://plot.ly/python/) - Easy to use 2D/3D plotting library by plotly. Not as interactive as bqplot but more efficient front-end and better default user experience. Integrates with the `pandas DataFrame` api. Interaction is described decleratively wheras with BQplot the majority of animation is done mutatively through python callbacks.

## Installing the Electron app permanently

First you need to build the desktop application for the desired operating system:

- Windows 32 Bit: `npm run build:win32`
- Windows 64 Bit: `npm run build:win64` (this is probably the one you want)
- Mac: `npm run build:mac`
- Linux: `npm run build:linux`

Then check the `dist` app for resulting install packages for your desired platform

## Want to Get Involved?

Studying at QUT? Contact us at qutmotorsport.team@gmail.com or [visit our website](https://www.qutmotorsport.com/) for details on how you can get involved.
