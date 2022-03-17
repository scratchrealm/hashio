import os

def get_hashio_storage_dir():
    from pathlib import Path
    homedir = str(Path.home())
    hsd = os.getenv('HASHIO_STORAGE_DIR', f'{homedir}/hashio-storage')
    if not os.path.exists(hsd):
        os.makedirs(hsd)
    return hsd