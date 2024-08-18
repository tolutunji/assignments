const environments = {};

environments.staging = {
    'httpPort' : 5500,
    'httpsPort' : 5530,
    'envName' : 'staging',
    'hashingSecret' : 'thelastwizard'
};
environments.production = {
    'httpPort' : 5550,
    'httpsPort' : 5590,
    'envName' : 'production',
    'hashingSecret' : 'timecandysunlight'
};


const currentEnvironment = typeof(process.env.NODE_ENV) ===  'string' ?  process.env.NODE_ENV.toLowerCase() : '';

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment]: environments.staging;

module.exports = environmentToExport;