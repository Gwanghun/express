const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const helmet = require('helmet')
const bodyParser = require('body-parser');
const compression = require('compression');
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');

app.use(helmet())   // 보안 관련 모듈

app.use(express.static('public'));    // 'public' 폴더를 static으로 사용하겠다.(정적 파일을 찾겟다)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// compress all responses
app.use(compression());

// 미들웨어 만들기 글 목록 읽어오기 - GET 방식으로 읽어오는 모든 페이지 --
app.get('*', function (req, res, next) {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next();
  });  
})


app.use('/', indexRouter);   // index 분리 - 디렉토리 개념, 유사한 기능을 하는 모듈을 분리 할 수 있다.

app.use('/topic', topicRouter);   // topic 분리


// 404 예외 처리 - 없는 페이지
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// 500 예외 처리 - 경로가 잘못된 페이지
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){

      } else {
        
      }
    } else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
      
    } else if(pathname === '/update'){
    
    } else if(pathname === '/update_process'){
    
    } else if(pathname === '/delete_process'){
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/