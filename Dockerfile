FROM continuumio/miniconda3

WORKDIR /app

# RUN pip uninstall h2
# RUN pip install h2===3.2.0

# Create the environment:
COPY environment.yml .
RUN conda env create -f environment.yml

# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "config-hub-env", "/bin/bash", "-c"]

# Make sure the environment is activated:
# RUN echo "Make sure quart is installed:"
# RUN python -c "import quart"

# The code to run when container is started:
COPY main.py .
ENTRYPOINT ["conda", "run", "-n", "config-hub-env", "python", "main.py"]