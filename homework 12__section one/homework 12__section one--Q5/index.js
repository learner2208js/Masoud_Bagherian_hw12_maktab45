const http = require('http');
const fs = require('fs');

http
  .createServer(function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (err, homePage) {
      if (err) {
        res.writeHead(404, {
          'content-type': 'text/html',
        });
        res.write('<h1>home page not found</h1>');
        res.end();
      } else {
        res.write(homePage);
        res.end();
      }
    });
  })
  .listen('8000', 'localhost');
