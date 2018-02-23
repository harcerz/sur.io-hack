const http = require('http')
const rocky = require('rocky')
var fs = require('fs')

const proxy = rocky({ forwardHost: true })
var dataImage = {};
var dataJs = {};

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
        //console.log(req.url.slice(req.url.lastIndexOf("/")+1))   
        if (dataImage[req.url.slice(req.url.lastIndexOf("/")+1)]!==undefined){
                res.setHeader('HACK', '!!!')
                res.body = Buffer.from(dataImage[req.url.slice(req.url.lastIndexOf("/")+1)], 'utf8')
                console.log(req.url.slice(req.url.lastIndexOf("/")+1) + " HACKED!")
        }  
    }
    else if (req.url.indexOf(".js") > -1){
      if (dataJs[req.url.slice(req.url.lastIndexOf("/")+1)]!==undefined){
        res.setHeader('HACK', '!!!')
        res.body = Buffer.from(dataJs[req.url.slice(req.url.lastIndexOf("/")+1)], 'utf8')
        console.log(req.url.slice(req.url.lastIndexOf("/")+1) + " HACKED!")
} 
    }
    next()
  })

proxy.routeAll()

readFiles('img/', function(filename, content) {
  dataImage[filename] = content;
  console.log("IMAGE FILE LOADED")
}, function(err) {
  throw err;
});

readFiles('jshack/', function(filename, content) {
  dataJs[filename] = content;
  console.log("JS FILE LOADED")
}, function(err) {
  throw err;
});

proxy.listen(3000)
console.log('Server listening on port:', 3000)