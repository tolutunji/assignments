const http = require('http');
const url = require('url')




const port = 5500;



const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl)

});







server.listen(port, () => {
    console.log(`Server running on port ${port}`)
});