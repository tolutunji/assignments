const  environments = {};


environments.staging = {
    "port" : "5700",
    "envName" : "staging"
};
environments.production = {
    "port" : "5750",
    "envName" : "production"
};


const currentEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV : "";


const environmentToExport = typeof(environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : environments.staging;


module.exports = environmentToExport;