import os
import requests

def store_file(filename: str):
    web3_storage_token = os.environ.get('WEB3_STORAGE_TOKEN', None)
    hashio_api_url = os.environ.get('HASHIO_API_URL', None)
    if not web3_storage_token and not hashio_api_url:
        raise Exception(f'Environment variable not set: WEB3_STORAGE_TOKEN or HASHIO_API_URL')
    if web3_storage_token:
        url = 'https://api.web3.storage/upload'
        headers = {
            'Authorization': f'Bearer {web3_storage_token}'
        }
        with open(filename, 'rb') as f:
            resp = requests.post(url, data=f, headers=headers)
        if resp.status_code != 200:
            raise Exception(f'Error storing file ({resp.status_code}) {resp.reason}: {resp.text}')
        cid = resp.json()['cid']
        return f'ipfs://{cid}'
    elif hashio_api_url:
        with open(filename, 'rb') as f:
            url = f'{hashio_api_url}/api/uploadToIpfs'
            resp = requests.post(url, data=f)
        if resp.status_code != 200:
            raise Exception(f'Error storing file via hashio api ({resp.status_code}) {resp.reason}: {resp.text}')
        cid = resp.json()['cid']
        return f'ipfs://{cid}'