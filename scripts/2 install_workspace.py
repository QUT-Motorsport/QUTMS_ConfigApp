import subprocess
from pathlib import Path
import sys
from time import sleep


def call(cmd, **kwargs):
    return subprocess.call(cmd, shell=True, **kwargs)


if __name__ == "__main__":
    REPO_NAME = "QUTMS_ConfigApp"
    repo_path = Path.home() / REPO_NAME
    call(f"git clone https://github.com/QUT-Motorsport/{REPO_NAME}.git {repo_path}")
    call(f"python install_dev.py --cache-env={Path(__file__).cwd() / "qev3-config-app.tar.gz"}", cwd=repo_path)
    call(f"code {repo_path}")
    quit()
