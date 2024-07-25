const http = require("http");
const url = require("url")





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

});




server.listen(port, function() {
    console.log(`Server started at port ${port}`)
});






