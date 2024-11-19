import os
import yaml

ROOT_DIR = os.getcwd()


def load_config() -> dict:
    with open(f"{ROOT_DIR}/config/settings.yaml", "r") as file:
        config = yaml.safe_load(file)

    return config
