const http = require('http')
const rocky = require('rocky')
var fs = require('fs')

// Creates the proxy with custom options
const proxy = rocky({ forwardHost: true })
var data = {};
var drzewo = null

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




fs.readFile('./img/map-tree-01.svg', 'utf8', function(err, contents) {
    drzewo = contents
});


// By default forward all the traffic to httpbin.org
proxy
  .forward('http://surviv.io')
  .useResponse(function (req, res, next) {
    if (req.url.indexOf(".svg") > -1){
        if (data[req.url.slice(req.url.lastIndexOf("/")+1)]!==undefined){
                res.setHeader('HACK', '!!!')

                //console.log(res.body.toString())
                res.body = Buffer.from(data[req.url.slice(req.url.lastIndexOf("/")+1)], 'utf8')
                console.log(req.url.slice(req.url.lastIndexOf("/")+1) + " HACKED!")
        }
            
    }
    next()
  })

// Route all the incoming traffic to the default target
proxy.routeAll()


readFiles('img/', function(filename, content) {
  data[filename] = content;
  proxy.listen(3000)

}, function(err) {
  throw err;
});


console.log('Server listening on port:', 3000)