const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;




const port = 5500;



const server = http.createServer((req, res) => {

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
            'payload' : buffer,
        };


        routeHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};


            const payloadString =  JSON.stringify(payload);

            res.writeHead(statusCode);
            res.end(payloadString)
        });
        

        //res.end('Pizza for your every occasion');
        
        console.log(buffer);
    });




});







server.listen(port, () => {
    console.log(`Server running on port ${port}`)
});





const handlers = {};


handlers.sample = (data, callback) => {
    callback(406, {'message' : 'The best stop for a pizza treat'})
};

handlers.notFound = (data, callback) => {
    callback(404, {'message' : 'Page not found'})
};



const router = {
    'sample' : handlers.sample,
};