const http = require('http');

http
  .createServer(function (req, res) {
    console.log(req.url);
    res.end();
  })
  .listen('8000', 'localhost');
