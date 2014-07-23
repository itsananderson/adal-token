#!/usr/bin/env node

var pkg = require('./package.json');
var fileExists = require('fs').existsSync;
var adal = require('adal-node');
var program = require('commander');
var request = require('request');
var defaults = require('lodash').defaults;

var home = process.env.HOME || process.env.USERPROFILE;
var configPath = home + '/adal-token-config.json';

var config = {envs:{}};

if (fileExists(configPath)) {
    config = require(configPath);
}

program
    .version(pkg.version)

    .option('--show-environments',
            'List details about available environments', false)

    .option('--env <environment>',
            'Environment against which the token will be generated')
    .option('-v, --verbose', 'Turn on debug output', false)

    .option('-t, --tenant [tenant]',
            'Tenant application to authenticate against. ' +
            'Defaults to tenant for selected environment', undefined)

    .option('-i, --client-id [clientId]',
            'Id of the client to authenticate. ' +
            'Defaults to client id for selected environment', undefined)

    .option('-s, --secret [clientSecret]',
            'Client secret of the client to authenticate. ' +
            'Defaults to secret for selected environment', undefined)

    .option('-r, --resource [resource]',
            'Resource to authenticate against. ' +
            'Defaults to resource for selected environment', undefined)

    .option('-e, --endpoint [endpoint]',
            'Endpoint to send a GET request to with the token. ' +
            'Specify empty to skip. ' +
            'Defaults to endpoint for selected environment', undefined)

    .option('-p, --proxy',
            'Proxy the GET request to the endpoint through Fiddler. ' +
            'Defaults to false', false);

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ adal-token --proxy');
    console.log('    $ adal-token --endpoint http://example.com/custom-request-url/');
});

program.parse(process.argv);

var log = program.verbose ? console.log.bind(console) : function() {};
adal.Logging.setLoggingOptions({
    level : adal.Logging.LOGGING_LEVEL.VERBOSE,
    log : function(level, message, error) {
        if (error) console.error(error);
        log(message);
    }
});

if (program.showEnvironments) {
    Object.keys(config.envs).forEach(function(env) {
        console.log(env);
    });
    return;
}

var authFlags = {
    'tenant' : program.tenant,
    'clientId' : program.clientId,
    'clientSecret' : program.secret,
    'resource' : program.resource,
    'endpoint' : program.endpoint
};

var authDetails = defaults(authFlags, config.envs[program.env || config.defaultEnv]);

if (authDetails.clientSecret == undefined) {
    console.error('Environment "%s" requires the client secret to be provided as a configuration flag', program.env);
    return;
}

var authorityUrl = 'https://login.windows.net/' + authDetails.tenant;

var context = new adal.AuthenticationContext(authorityUrl);


context.acquireTokenWithClientCredentials(authDetails.resource, authDetails.clientId, authDetails.clientSecret, function(err, tokenResponse) {
    if (err) {
        console.error('Error retrieving token: ' + err.stack);
    } else {
        console.log(tokenResponse.accessToken);

        if (authDetails.endpoint !== "") {
            console.log('');
            var requestOptions = {
                'uri': authDetails.endpoint,
                'auth' : {
                    'bearer': tokenResponse.accessToken
                }
            };

            if (program.proxy) {
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
                requestOptions.proxy = 'http://localhost:8888';
            }

            request.get(requestOptions, function(err, res, body) {
                if (err) {
                    throw err;
                }
                //try {
                //    body = JSON.parse(body);
                //} catch(e) {}
                console.log(body);
            });
        }
    }
});
