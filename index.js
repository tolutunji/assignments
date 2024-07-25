const http = require("http");
const url = require("url")





const port = 5700;



const server = http.createServer(function(req, res) {

    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl)

});




server.listen(port, function() {
    console.log(`Server started at port ${port}`)
});






