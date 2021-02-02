const http = require('http');
const fs = require('fs');
let users = [];
fs.readFile('./public/json/users.json', 'utf-8', function (err, data) {
  if (err) {
    return console.log('users file read failed!');
  }
  users = JSON.parse(data);
});
function isUserAvailable(searchedUser) {
  for (const user of users) {
    if (
      user.username === searchedUser.username &&
      user.password === searchedUser.password
    ) {
      return true;
    }
  }
  return false;
}
function downloadFile(res, url) {
  fs.readFile(`.${url}`, function (err, file) {
    if (err) {
      res.writeHead(404);
    } else {
      res.write(file);
    }
    res.end();
  });
}
http
  .createServer(function (req, res) {
    const path = req.url;

    if (path === '/') {
      fs.readFile('./index.html', 'utf-8', function (err, homePage) {
        if (err) {
          res.writeHead(404);
        } else {
          res.write(homePage);
        }
        res.end();
      });
      // download css files from server
    } else if (path.includes('/public/css/')) {
      downloadFile(res, path);
      // download js files from server
    } else if (path.includes('/public/js/')) {
      downloadFile(res, path);

      // download images from server
    } else if (path.includes('/public/image/')) {
      downloadFile(res, path);
      // download fonts from server
    } else if (path.includes('/public/fonts')) {
      if (path.includes('?')) {
        const fontPath = path.split('?')[0];
        downloadFile(res, fontPath);
      } else {
        downloadFile(res, path);
      }
    } else if (path === '/check-user' && req.method.toLowerCase() === 'post') {
      let data = '';
      const response = {
        userAvailable: false,
        message: 'کاربری با این مشخصات وجود ندارد',
        color: '#940909',
      };
      req.on('data', function (reqBody) {
        data = reqBody.toString();
      });
      req.on('end', function () {
        if (isUserAvailable(JSON.parse(data))) {
          response.userAvailable = true;
          response.message = 'ورود موفقیت امیز';
          response.color = '#28a745';
        }
        res.write(JSON.stringify(response));
        res.end();
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen('8000');
