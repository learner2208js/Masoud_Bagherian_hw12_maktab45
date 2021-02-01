const http = require('http');
const fs = require('fs');

http
  .createServer(function (req, res) {
    let path = req.url;

    if (path === '/') {
      fs.readFile('./index.html', 'utf-8', function (err, homePage) {
        res.write(homePage);
        res.end();
      });
    } else if (path.includes('/assets/')) {
      if (path.includes('fontawesome-webfont')) {
        path = path.split('?')[0];
      }
      fs.readFile(`.${path}`, function (err, data) {
        if (err) {
          res.writeHead(404);
        } else {
          res.write(data);
        }
        res.end();
      });
    }
  })
  .listen('8000', 'localhost');
