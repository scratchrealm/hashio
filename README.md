# hashio

Simple Python interface to content-addressable storage on IPFS.

## Installation and setup

```bash
pip install git+https://github.com/scratchrealm/hashio
```

Hashio stores content on IPFS via FileCoin. The preferred method is via [web3.storage](https://web3.storage/). You can [create an account here](https://web3.storage/) using your github login. Once you get an API token, set the following environment variable:

```bash
export WEB3_STORAGE_TOKEN="paste-taken-here"
```

Alternatively, if you don't want to use a web3.storage token, you can use our account for now by setting the following environment variable:

```bash
export HASHIO_API_URL="https://hashio.vercel.app"
```

Note that this latter method may be throttled or discontinued over time.

## Storing data

From command line

```bash
echo "test-content" > test_content.txt
hashio-store test_content.txt
# output:
# ipfs://bafkreiajr6u7obg3mpunezz2mwarr2sptwr3zaedia665vdayvw6mpn5ga
```

From Python

```python
import hashio as ha

uri = ha.store_file('filename.dat')
uri = ha.store_text('example text')
uri = ha.store_json({'example': 'dict'})
uri = ha.store_npy(array)
uri = ha.store_pkl({'example': array})
```

## Loading data

From command line

```bash
hashio-load ipfs://bafkreiajr6u7obg3mpunezz2mwarr2sptwr3zaedia665vdayvw6mpn5ga
# output:
# /home/user/hashio-storage/ipfs/ba/fk/re/bafkreiajr6u7obg3mpunezz2mwarr2sptwr3zaedia665vdayvw6mpn5ga
```

From Python

```python
import hashio as ha

local_fname = ha.load_file('ipfs://bafkreiajr6u7obg3mpunezz2mwarr2sptwr3zaedia665vdayvw6mpn5ga')
text = ha.load_text('ipfs://bafkreiajr6u7obg3mpunezz2mwarr2sptwr3zaedia665vdayvw6mpn5ga')
x = ha.load_json(uri)
y = ha.load_npy(uri)
z = ha.load_pkl(uri)
```

## Limitations

Uploads are subject to the limits of web3.storage (for example, no more than 30 uploads per 10 seconds).

If you are using our service for uploading to IPFS (not your own web3.storage token), then uploads are limited to 50 MiB and are not guaranteed to be available forever. Also, the upload rate may be throttled.
