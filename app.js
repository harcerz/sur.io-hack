const http = require('http')
const rocky = require('rocky')
var fs = require('fs')

const proxy = rocky({ forwardHost: true })
var data = {};

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

proxy
  .forward('http://surviv.io')
  .useResponse(function (req, res, next) {
    if (req.url.indexOf(".svg") > -1){
        console.log(req.url.slice(req.url.lastIndexOf("/")+1))   
        if (data[req.url.slice(req.url.lastIndexOf("/")+1)]!==undefined){
                res.setHeader('HACK', '!!!')
                res.body = Buffer.from(data[req.url.slice(req.url.lastIndexOf("/")+1)], 'utf8')
                console.log(req.url.slice(req.url.lastIndexOf("/")+1) + " HACKED!")
        }
        else
        console.log(req.url)   
    }
    next()
  })

proxy.routeAll()

readFiles('img/', function(filename, content) {
  data[filename] = content;
  console.log(data)
 

}, function(err) {
  throw err;
});

proxy.listen(3000)
console.log('Server listening on port:', 3000)