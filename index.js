const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;





const port = 5700;



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

        res.end("Pizza for all and sundry")



        console.log(buffer)

    });


});




server.listen(port, function() {
    console.log(`Server started at port ${port}`)
});






