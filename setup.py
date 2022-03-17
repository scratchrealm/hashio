from setuptools import setup, find_packages

setup(
    packages=find_packages(),
    scripts=[
        'bin/hashio',
        'bin/hashio-store',
        'bin/hashio-load'
    ],
    include_package_data = True,
    install_requires=[
        'requests',
        'click',
        'simplejson'
    ]
)
