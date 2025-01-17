const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const handlers = require('./lib/handlers');
const fs = require('fs');
// const deal = require('./lib/data');
const helpers = require('./lib/helpers')



// deal.create('profile', 'person', {'name':'patrick'}, function(err){
//     console.log('This is an error', err)
// });
// deal.read('profile', 'person', function(err,data){
//     console.log('This is an error', err, data)
// });
// deal.update('profile', 'person', {'name':'Abu Ezekiel', 'age' : 44, 'sex' : 'male'}, function(err){
//     console.log('This is an error', err)
// });
// deal.delete('profile', 'person', function(err){
//     console.log('This is an error', err)
// });


const httpServer = http.createServer((req, res) => {

    requestHandler(req, res);
});

httpServer.listen(config.httpPort, () => {
    console.log(`Server running on port ${config.httpPort} and in ${config.envName} mode`)
});


httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pen'),
    'cert' : fs.readFileSync('./https/cert.pen')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {

    requestHandler(req, res);
});

httpsServer.listen(config.httpsPort, () => {
    console.log(`Server running on port ${config.httpsPort} and in ${config.envName} mode`)
});

const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);

    const path = parsedUrl.pathname;
    console.log(path);

    const trimmedPath =  path.replace(/^\/+|\/+$/g, '');
    console.log(trimmedPath);

    const method = req.method.toLowerCase();
    console.log(method);

    const queryStringObject = parsedUrl.query;
    console.log(queryStringObject);

    const headers = req.headers;
    console.log(headers);

    const decoder = new StringDecoder('utf-8');

    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data)
    });

    req.on('end', () => {
        buffer += decoder.end()

        let routeHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;



        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer),
        };


        routeHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};


            const payloadString =  JSON.stringify(payload);


            //res.setHeader('Content-Type' , 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString)
        });
        

        //res.end('Pizza for your every occasion');
        
        console.log(buffer);
    });

}














const router = {
    'sample' : handlers.sample,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'menu' : handlers.menu,
    'cart' : handlers.cart,
}; 