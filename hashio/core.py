import os
import random
from typing import Any, Union
import requests

from .get_hashio_storage_dir import get_hashio_storage_dir
from .TemporaryDirectory import TemporaryDirectory
from ._safe_pickle import _safe_pickle, _safe_unpickle

def store_file(filename: str) -> str:
    size = os.path.getsize(filename)
    init_url = f'https://us-east4-hashio-344322.cloudfunctions.net/initializeFileUpload?size={size}'
    init_response = requests.get(init_url)
    if init_response.status_code != 200:
        raise Exception(f'Error initializing file upload ({init_response.status_code}): {init_response.reason}')
    x = init_response.json()
    upload_url = x['uploadUrl']
    file_name = x['fileName']
    headers = {
        'Content-Type': 'application/octet-stream',
        'Content-Length': f'{size}'
    }
    with open(filename, 'rb') as f:
        requests.put(
            upload_url,
            data=f,
            headers=headers
        )
    finalize_url = f'https://us-east4-hashio-344322.cloudfunctions.net/finalizeFileUpload?fileName={file_name}'
    finalize_response = requests.get(finalize_url)
    if finalize_response.status_code != 200:
        raise Exception(f'Error finalizing file upload ({finalize_response.status_code}): {finalize_response.reason}')
    y = finalize_response.json()
    sha1 = y['sha1']
    return f'sha1://{sha1}'

def load_file(uri: str) -> Union[str, None]:
    assert uri.startswith('sha1://'), f'Invalid URI: {uri}'
    a = uri.split('/')
    assert len(a) >= 3, f'Invalid URI: {uri}'
    sha1 = a[2]
    assert len(sha1) == 40, f'Invalid URI: {uri}'

    hashio_storage_dir = get_hashio_storage_dir()
    parent_dir = f'{hashio_storage_dir}/sha1/{sha1[0]}{sha1[1]}/{sha1[2]}{sha1[3]}/{sha1[4]}{sha1[5]}'
    filename = f'{parent_dir}/{sha1}'
    if os.path.exists(filename):
        return filename

    init_url = f'https://us-east4-hashio-344322.cloudfunctions.net/initializeFileDownload?sha1={sha1}'
    init_response = requests.get(init_url)
    if init_response.status_code != 200:
        raise Exception(f'Error initializing file download ({init_response.status_code}): {init_response.reason}')
    x = init_response.json()
    found = x['found']
    if not found:
        return None
    download_url = x['downloadUrl']
    
    if not os.path.exists(parent_dir):
        os.makedirs(parent_dir)
    tmp_filename = f'{filename}.tmp.{_random_string(8)}'
    with requests.get(download_url, stream=True) as r:
        r.raise_for_status()
        with open(tmp_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    try:
        os.rename(tmp_filename, filename)
    except:
        if not os.path.exists(filename): # maybe some other process beat us to it
            raise Exception(f'Unexpected problem moving file {tmp_filename}')
    return filename
    
def store_text(text: str) -> str:
    with TemporaryDirectory() as tmpdir:
        fname = f'{tmpdir}/file.dat'
        with open(fname, 'w') as f:
            f.write(text)
        return store_file(fname)

def store_json(x: Any, *, separators=(',', ':'), indent=None) -> str:
    import simplejson
    text = simplejson.dumps(object, separators=separators, indent=indent, allow_nan=False)
    return store_text(text)

def store_npy(array: Any) -> str:
    import numpy as np
    with TemporaryDirectory() as tmpdir:
        fname = f'{tmpdir}/file.npy'
        np.save(fname, array, allow_pickle=False)
        return store_file(fname)

def store_pkl(x: Any) -> str:
    with TemporaryDirectory() as tmpdir:
        fname = f'{tmpdir}/file.npy'
        _safe_pickle(fname, x)
        return store_file(fname)

def load_text(uri: str) -> Union[str, None]:
    local_path = load_file(uri)
    if local_path is None:
        return None
    with open(local_path, 'r') as f:
        return f.read()

def load_json(uri: str) -> Union[dict, None]:
    import simplejson
    local_path = load_file(uri)
    if local_path is None:
        return None
    with open(local_path, 'r') as f:
        return simplejson.load(f)

def load_npy(uri: str) -> Union[Any, None]:
    import numpy as np
    local_path = load_file(uri)
    if local_path is None:
        return None
    return np.load(local_path, allow_pickle=False)

def load_pkl(uri: str) -> Union[Any, None]:
    local_path = load_file(uri)
    if local_path is None:
        return None
    return _safe_unpickle(local_path)

def _random_string(num_chars: int) -> str:
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return ''.join(random.choice(chars) for _ in range(num_chars))