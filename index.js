const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./indexConfig")








const server = http.createServer(function(req, res) {

    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);

    const path = parsedUrl.pathname;
    console.log(path);

    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    console.log(trimmedPath);

    const method = req.method.toLowerCase();
    console.log(method);

    const queryStringObject = parsedUrl.query;
    console.log(queryStringObject);

    const headers = req.headers;
    console.log(headers);

    const decoder = new StringDecoder("utf-8");

    let buffer = "";

    req.on("data", function(data) {
        buffer += decoder.write(data)
    });
    
    req.on("end", function() {
        buffer += decoder.end()

        let chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;

        const data = {
            "trimmedPath" : trimmedPath,
            "queryStringObject" : queryStringObject,
            "method" : method,
            "headers" : headers,
            "payload" : buffer,
        };



        chosenHandler(data, function(statusCode, payload) {

            statusCode = typeof(statusCode) === "number" ? statusCode : 200;
            payload = typeof(payload) === "object" ? payload : {};


            const payloadString = JSON.stringify(payload);

            //res.setHeader("Content-Type" , "application/json")
            res.writeHead(statusCode);
            res.end(payloadString)
        })

        // res.end("Pizza for all and sundry")



        console.log(buffer)

    });


});




server.listen(config.port, function() {
    console.log(`Server started at port ${config.port} and in ${config.envName} mode`)
});






const handlers = {};

handlers.sample = function(data, callback){
    callback(406, {"message":"This is your ideal pizza stop"})
}

handlers.notFound = function(data, callback){
    callback(404, {"message":"Page not found"})
}




const router = {
    "sample":handlers.sample,
};
