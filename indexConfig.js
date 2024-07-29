const  environments = {};


environments.staging = {
    "httpPort" : "5700",
    "httpsPort" : "5730",
    "envName" : "staging"
};
environments.production = {
    "httpPort" : "5750",
    "httpsPort" : "5790",
    "envName" : "production"
};


const currentEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV : "";


const environmentToExport = typeof(environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : environments.staging;


module.exports = environmentToExport;