const http = require('http');
const fs = require('fs');

http
  .createServer(function (req, res) {
    const path = req.url;
    if (path === '/') {
      res.write('<h1>hello world!</h1>');
      res.end();
    } else if (path === '/users') {
      fs.readFile('./users/users.json', 'utf-8', function (err, users) {
        if (err) {
          res.writeHead(404, {
            'content-type': 'text/html',
          });
          res.write('<h1>users not found</h1>');
          res.end();
          return;
        }
        res.write(users);
        res.end();
      });
    } else {
      res.writeHead(404);
      res.write('<h1>page not found!</h1>');
      res.end();
    }
  })
  .listen(8000, 'localhost');
