import click
import hashio as ha

@click.group(help="Hashio command-line client")
def cli():
    pass

@click.command(help="Store file in hashio")
@click.argument('filename')
def store_file(filename: str):
    uri = ha.store_file(filename)
    print(uri)

@click.command(help="Load file from hashio")
@click.argument('uri')
def load_file(uri: str):
    fname = ha.load_file(uri)
    print(fname)

cli.add_command(store_file)
cli.add_command(load_file)
