conda env update -f ./environment.yml

jupyter labextension install \
  bqplot@0.5.2 \
  jupyterlab-plotly@1.4.0 \
  plotlywidget@1.4.0

cd config-app

npm i