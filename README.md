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

Config File
-----------

When it starts, adal-token looks for a config in ~/adal-token-config.json. If that file exists, it is loaded, and any pre-configured environments can be used by name.

For example, consider the following config;

```json
{
  "defaultEnv": "dev",
  "envs": {
    "dev": {
      "tenant": "<yourtenant>.onmicrosoft.com",
      "clientId": "00000000-0000-0000-0000-000000000000",
      "clientSecret": "===your client secret here===",
      "resource": "http://example.com/resource-youre-requesting-access-to/",
      "endpoint": "http://example.com/resource-to-send-request-to/"
    }
  }
}
```

The "envs" key has a map of environment names to configurations.
The "defaultEnv" key sets a default environment to use if no --env flag is provided.

If you don't want to store sensitive info in your config, you can store everything except your client secret, and then provide that as a command line arg
