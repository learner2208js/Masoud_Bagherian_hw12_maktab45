const http = require('http');

http
  .createServer(function (req, res) {
    if (req.url === '/') {
      res.write('<h1>hello world!</h1>');
      res.end();
    } else {
      res.writeHead(404);
      res.write('<h1>page not found!</h1>');
      res.end();
    }
  })
  .listen(8000, 'localhost');
