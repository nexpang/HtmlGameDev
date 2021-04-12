const http = require("http");
const server = http.createServer((req, res) => {
    res.write("<h1>hello node server</h1>");
});

server.listen(8080, () => {

})