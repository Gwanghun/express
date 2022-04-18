var http = require('http');
var cookie = require('cookie');
http.createServer(function (req, res) {
  console.log(req.headers.cookie);
  var cookies = {};
  if (req.headers.cookie !== undefined) {
    cookies = cookie.parse(req.headers.cookie);
  }

  console.log(cookies.yummy_cookie);
  res.writeHead(200, {
    'Set-Cookie': [
      'yummy_cookie=choco',
      'tasty_cookie=strawberry',
      `permanent=cookies; Max-Age=${60 * 60}`,
      'Path=Path; Path=/cookie'

    ]
  });
  res.end('Cookie!!');
}).listen(3000);