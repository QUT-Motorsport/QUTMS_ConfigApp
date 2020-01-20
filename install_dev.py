from subprocess import check_output
from sys import argv
from shutil import which as exists
import tarfile
from pathlib import Path
import re

def call(command):
    return check_output(command.split())


if __name__ == "__main__":

    with open('./environment.yml', 'r') as env_file:
        conda_env_name = env_file.readline().split()[1]

    CACHE_ENV_ARG_FLAG = "--cache-env="
    cache_env = Path(argv[1][len(CACHE_ENV_ARG_FLAG):]) \
        if len(argv) > 1 and argv[1].startswith(CACHE_ENV_ARG_FLAG) \
        else None
    
    # ensure conda is at the latest version
    call("conda update -n base -y conda")

    # extract the env cache if it has been specified and exists
    if cache_env is not None and cache_env.exists():
        target_env_dir = Path(
            re.search(
                r'base environment : (\S+?)  \(writable\)',
                str(call("conda info"))
            ).group(1)
        ) / CONDA_ENV_NAME

        if not target_env_dir.exists():
            target_env_dir.mkdir()
        
        tarfile.open(cache_env, 'r:gz').extractall(target_env_dir)

    # install / update the "qev3-config-app" conda environment and all python / C++ dependencies
    call("conda env update -f ./environment.yml --prune")

    # if powershell is on the system, 'support' it by running this additional step
    if which("powershell") is not None:
        # note that this adds a powershell script that runs on powershell start and is needed for powershell integration
        # however powershell scripts are disabled on QUT computers, so powershell can't be used at QUT with conda.
        call("conda init powershell")

    call(
        # activate conda environment
        f"conda activate {conda_env_name}" \

        # install all the js components of jupyterlab and their widgets at once
        + ' && jupyter labextension install' \
            + ' "@jupyter-widgets/jupyterlab-manager@1.0.3"' \
            + ' bqplot@0.5.2' \
            + ' jupyterlab-plotly@1.4.0' \
            + ' plotlywidget@1.4.0"'
        
        # install js dependencies of the 
        + ' && cd config-app && npm i'
    )

    # if env_cache was specified, use conda-pack to update / create the cache
    if cache_env is not None:
        import conda_pack
        conda_pack.pack(name=conda_env_name, output=cache_env)

    # install vscode extensions helpful for development
    call(
        "code --install-extension ms-python.python" \
        + " && code --install-extension esbenp.prettier-vscode"
    )