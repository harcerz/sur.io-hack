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
   /* else if (req.url.indexOf(".js") > -1){
      if (dataJs[req.url.slice(req.url.lastIndexOf("/")+1)]!==undefined){
        res.setHeader('HACK', '!!!')
        res.body = Buffer.from(dataJs[req.url.slice(req.url.lastIndexOf("/")+1)], 'utf8')
        console.log(req.url.slice(req.url.lastIndexOf("/")+1) + " HACKED!")
      } 
    }*/
    else if (req.url.indexOf(".js") > -1 && req.url.indexOf("app") > -1 && req.url.indexOf("map") == -1){
      
        res.setHeader('HACK', '!!!')

        var str = res.body.toString();
        try{
          str = str.replace('Please use the <a href="https://surviv.io" target="_blank">official surviv.io site</a> for a better playing experience!', "Gra poprawiona! //MS");
          str = str.replace('getClosestLoot();', 'getClosestLoot(); t.localData.inventory["2xscope"] = 1; t.localData.inventory["4xscope"] = 1; t.localData.inventory["8xscope"] = 1; t.localData.inventory["15xscope"] = 1; /* MS */');
          str = str.replace('this.activePlayer.getScopeZoom();', ' this.activePlayer.getScopeZoom(); if(window.zoomTest){ switch(window.zoomTest) { case "2xscope": t = 36; break; case "4xscope": t = 48; break; case "8xscope": t = 68; break; case "15xscope": t = 104; break; default: t = 48; }} /* MS */');
          str = str.replace('"1xscope":28', '"1xscope":40');
          var znak = str.substring(str.indexOf(".useScope=l(")-1, str.indexOf(".useScope=l("));
          str = str.replace('h.useScope=l(e.currentTarget).attr("data-item")', 'h.useScope=l(e.currentTarget).attr("data-item"); window.zoomTest = h.useScope /* MS */');
          str = str.replace('Battle Royale 2D', 'Hacked by Harcerz :D');      
          
        }
        catch(error){
          consle.log("dupa", error)
        }
        res.body = Buffer.from(str);
        //res.body = Buffer.from(dataJs[req.url.slice(req.url.lastIndexOf("/")+1)], 'utf8')
        console.log(req.url.slice(req.url.lastIndexOf("/")+1) + " AUTO HACKED!")
      
    }
    next()
  })

proxy.routeAll()

readFiles('img/', function(filename, content) {
  dataImage[filename] = content;
  console.log(filename + " LOADED")
}, function(err) {
  throw err;
});

proxy.listen(3000)
console.log('Server listening on port:', 3000)



/*
getClosestLoot(); ->
          getClosestLoot();
          t.localData.inventory["2xscope"] = 1 //MS
					t.localData.inventory["4xscope"] = 1 
					t.localData.inventory["8xscope"] = 1 
          t.localData.inventory["15xscope"] = 1 
          
this.activePlayer.getScopeZoom() ->
          this.activePlayer.getScopeZoom();
                if(window.zoomTest){ //MS zmiana celownika
                  switch(window.zoomTest) {
                    case "2xscope":
                      t = 36
                      break;
                    case "4xscope":
                      t = 48
                      break;
                    case "8xscope":
                      t = 68
                      break;
                    case "15xscope":
                      t = 104
                      break;
                    default:
                      t = 48
                  }
                }

 ), this.useScope = "", ->

 this.useScope = "", l(document).on("click", ".ui-zoom-inactive", function (e) {
                e.stopPropagation(), h.useScope = l(e.currentTarget).attr("data-item")
                window.zoomTest = h.useScope //MS wybór celownika
*/