# Setting environment variables for hashio

To complete the setup, you must set an environment variable to specify the mechanism hashio will use to store files on IPFS. There are currently two supported methods:
* Using a [web3.storage](https://web3.storage) token (preferred)
* Using our public IPFS upload service (easiest)

## Using a web3.storage token

The preferred method is to sign up for a free acount on [web3.storage](https://web3.storage). You can use your github login to set up an account and log in. Once you have logged in, obtain an API token and set the environment variable:

```bash
export HASHIO_WEB3_STORAGE_TOKEN="paste-token-here"
```

Web3.storage provides 1 TiB of space for free. They will pin the data on IPFS and also store it long term on [Filecoin](https://filecoin.io/). While they claim that your files will be available on IPFS forever, this of course depends on whether web.storage continues to operate.

## Using our public IPFS upload service

The easier, but less preferred, method is to use our service by simply setting the following environment variable:

```bash
export HASHIO_API_URL="https://hashio.figurl.org"
```

This is a good method for getting started with relatively small uploads. Note that this latter method may be throttled and/or discontinued in the future.