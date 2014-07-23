ADAL Token Generator
====================

This tool generates ADAL bearer tokens based on a given configuration

I got tired of having to run functional tests to generate an ADAL token, so I wrote this tool.

Installing
----------

`npm install -g adal-token`

Usage
-----

Using the tool is even easier.
From the command line run:

`adal-token`

The default behavior is to generate and output a token for the default client client,
then submit a GET request to its endpoint. This is all configurable through flags.

You can use different client, tenant, and resource info (see full option list below).

You can disable the GET request and just output the token:

`adal-token --endpoint ""`

You can send the GET request through Fiddler (so you can drag the request into the Composer tab).

`adal-token --proxy`

To see all configuration options, run:

`adal-token --help`
