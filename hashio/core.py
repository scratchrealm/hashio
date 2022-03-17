import os
import requests

def store_file(filename: str):
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
    print(y)
    sha1 = y['sha1']
    return f'sha1://{sha1}'

def load_file(uri: str):
    assert uri.startswith('sha1://'), f'Invalid URI: {uri}'
    a = uri.split('/')
    assert len(a) >= 3, f'Invalid URI: {uri}'
    sha1 = a[2]
    assert len(sha1) == 40, f'Invalid URI: {uri}'
    init_url = f'https://us-east4-hashio-344322.cloudfunctions.net/initializeFileDownload?sha1={sha1}'
    print(init_url)
    init_response = requests.get(init_url)
    if init_response.status_code != 200:
        raise Exception(f'Error initializing file download ({init_response.status_code}): {init_response.reason}')
    x = init_response.json()
    download_url = x['downloadUrl']
