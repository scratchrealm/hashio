# hashio

Content-addressable cloud storage.

## Installation

```bash
pip install git+https://github.com/scratchrealm/hashio
```

## Storing data

From command line

```bash
echo "test-content" > test_content.txt
hashio-store test_content.txt
# output:
# sha1://b971c6ef19b1d70ae8f0feb989b106c319b36230
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
hashio-load sha1://b971c6ef19b1d70ae8f0feb989b106c319b36230
# output:
# /home/user/hashio-storage/sha1/b9/71/c6/b971c6ef19b1d70ae8f0feb989b106c319b36230
```

From Python

```python
import hashio as ha

local_fname = ha.load_file('sha1://b971c6ef19b1d70ae8f0feb989b106c319b36230')
text = ha.load_text('sha1://b971c6ef19b1d70ae8f0feb989b106c319b36230')
x = ha.load_json(uri)
y = ha.load_npy(uri)
z = ha.load_pkl(uri)
```