conda env update -f ./environment.yml

conda activate qev3-config-app

jupyter labextension install "@jupyter-widgets/jupyterlab-manager@1.0.3" "bqplot@0.5.2" "jupyterlab-plotly@1.4.0" "plotlywidget@1.4.0"

cd config-app

npm i