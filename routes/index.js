const express = require('express');
const router = express.Router();
const template = require('../lib/template.js');
const cookie = require('cookie');

function authIsOwner(req) {
  var isOwner = false;
  var cookies = {};
  if (req.headers.cookie) {
    cookies = cookie.parse(req.headers.cookie);
  }
  if ( cookies.email && cookies.password ) {
    isOwner = true;
  }

  return isOwner;
}

function authStatusUI(req) {
  var authStatusUI = `<a href="/login">Login</a>`;
  if ( authIsOwner(req) ) {
    authStatusUI = `<a href="/logout_process">logout</a>`;
  }

  return authStatusUI;
}

router.get('/', function (req, res) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  
  var html = template.HTML(title, list,
    `
    <h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px;display:block;margin-top:10px;">
    `,
    `<a href="/topic/create">create</a>`,
    authStatusUI(req)
  );
  res.send(html);
})

router.get('/login', function (req, res) {
  var title = 'Login';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(title, list,
    `
    <form action="/login_process" method="post">
      <p> <input type="text" name="email" placeholder="email"> </p>
      <p> <input type="password" name="password" placeholder="password"> </p>
      <p> <input type="submit" > </p>
    </form>
    `,
    `<a href="/topic/create">create</a>`
  );
  res.send(html);
})

router.post('/login_process', function (req, res) {
  var post = req.body;
  if ( post.email === 'hooeni' && post.password === '111111' ) {
    res.writeHead(302, {
      'Set-Cookie': [
        `email=${post.email}`,
        `password=${post.password}`,
        `nickname=hooeni`
      ],
      Location: `/`
    });
    res.end();
  }
  else {
    res.send('Who are you? <a href="/login">login</a>');
  }
  // res.redirect(`/topic/${title}`);
  
});

module.exports = router;