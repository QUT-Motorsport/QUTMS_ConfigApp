FROM continuumio/miniconda3

RUN conda init bash

# initialise conda environment
COPY environment.yml .
RUN conda env create -f environment.yml

# Activate the environment, and make sure it's activated:
RUN conda activate config-hub-env
RUN echo "Make sure quart is installed:"
RUN python -c "import quart"

# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "config-hub-env", "/bin/bash", "-c"]

# The code to run when container is started:
COPY main.py .
ENTRYPOINT ["conda", "run", "-n", "config-hub-env", "python", "main.py"]