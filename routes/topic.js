const express = require('express');
const router = express.Router();
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
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

router.get('/create', function (req, res) {
  var title = 'WEB - create';
  var list = template.list(req.list);
  var html = template.HTML(title, list, `
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `, '',authStatusUI(req));
  res.send(html);
})





router.post('/create_process', function (req, res) {  
  var post = req.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    res.redirect(`/topic/${title}`);
  })
})


router.get('/update/:pageId', function (req, res) {
  const params = req.params;
  var filteredId = path.parse(params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    var title = params.pageId;
    var list = template.list(req.list);
    var html = template.HTML(title, list,
      `
      <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
      authStatusUI(req)
    );
    res.send(html);
  });
})

router.post('/update_process', function (req, res) {
  var post = req.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      res.redirect(`/topic/${title}`);
    })
  });
})

router.post('/delete_process', function (req, res) {
  var post = req.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    res.redirect('/');
  })
})

router.get('/:pageId', function (req, res, next) {
  const params = req.params;
  var filteredId = path.parse(params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    if (err) {
      next(err);   // next('route');
    }
    else {
      var title = params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(req.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`,
          authStatusUI(req)
      );
      res.send(html);
    }
  });

})


module.exports = router;