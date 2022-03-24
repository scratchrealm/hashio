# hashio

Simple Python interface to content-addressable storage on [IPFS](https://ipfs.io/) with minimal configuration.

## Installation and setup

```bash
pip install --upgrade git+https://github.com/scratchrealm/hashio
```

To complete the setup you must [set an environment variable to specify the mechanism hashio will use to store files on IPFS](./doc/hashio_env.md).

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
