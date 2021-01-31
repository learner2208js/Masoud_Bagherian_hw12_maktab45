const http = require('http');

http
  .createServer(function (req, res) {
    const path = req.url;
    if (path === '/') {
      res.write('<h1>Hello Web Application</h1>');
      res.end();
    } else if (path === '/about') {
      res.write('<h1>About Me</h1>');
      res.end();
    } else if (path === '/contact') {
      res.write('<h1>Contact us</h1>');
      res.end();
    } else if (path === '/login') {
      res.write('<h1>login page</h1>');
      res.end();
    } else if (path === '/services') {
      res.write('<h1>Our services</h1>');
      res.end();
    } else {
      res.writeHead(404, {
        'content-type': 'text/html',
      });
      res.write('<h1>page not found</h1>');
      res.end();
    }
  })
  .listen('8000', 'localhost');
