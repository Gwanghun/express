const express = require('express');
const router = express.Router();
const template = require('../lib/template.js');

router.get('/', function (req, res) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(title, list,
    `
    <h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px;display:block;margin-top:10px;">
    `,
    `<a href="/topic/create">create</a>`
  );
  res.send(html);
})

router.get('/login', function (req, res) {
  var title = 'Login';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(title, list,
    `
    <form action="login_process" method="post">
      <p> <input type="text" name="email" placeholder="email"> </p>
      <p> <input type="password" name="password" placeholder="password"> </p>
      <p> <input type="submit" > </p>
    </form>
    `,
    `<a href="/topic/create">create</a>`
  );
  res.send(html);
})

module.exports = router;