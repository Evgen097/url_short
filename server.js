const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));


MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})








/*

Check your git status by entering the command 'git status' into the console.
Add your files with the command 'git add .'
Commit your changes with 'git commit -m "initial commit".
Create a new GitHub repository. Then copy its .git URL.
Return to c9.io's terminal and set your GitHub remote URL: 'git remote add origin https://github.com/Evgen097/timestemp.git' followed by the URL you copied from GitHub.
Run 'git push origin master'

Open up your application in a preview tab by clicking Window > Share > Application > Open

To run your application run the command: 
node server.js






////////////////////////////////////////////////////////////////////////////////////

var express = require('express')
var app = express()
var null_obj = JSON.stringify( {"unix":null,"natural":null} );


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = month + ' ' + date  + ' ' + year;
  var obj = { "unix": UNIX_timestamp, "natural": time }
  return JSON.stringify(obj);
}

app.get('/', function (req, res) {
  console.log('Hello World!')
  res.send('Hello World!')
})

app.get('/:time', function (req, res) {
  if(+req.params.time > 0){
    var time = timeConverter(req.params.time);
      console.log(time)
      res.send(time)
  }else{
     var time2 =  new Date(req.params.time).getTime()/1000;
     if (time2 > 0){
         var obj2 = { "unix": time2 , "natural": req.params.time }
         console.log( obj2 )
          res.send( obj2 )
     }else{
        console.log(null_obj)
        res.send(null_obj)
     }
  }
})

app.listen(process.env.PORT || 8080, function () {
  console.log("Server has started.")
})




///////////////////////////////////////////////////////////////////////////////
var http = require("http");
var url = require("url");
var today = new Date();
var null_obj = JSON.stringify( {"unix":null,"natural":null} );

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var time = month + ' ' + date  + ' ' + year;
  var obj = { "unix": UNIX_timestamp, "natural": time }
  return JSON.stringify(obj);
}


function timeConvString(arr){
  for (var i in arr){
    if (+arr[i] > 0){
      if(arr[i].length == 6){
        var year = arr[i].slice(2);
        //console.log ('year = ' + arr[i].slice(2) )
      }else{
        var day = arr[i].slice(2);
        //console.log ('day = ' + arr[i].slice(2) )
      }
    }else{
      var months = arr[i];
      //console.log ('mounts = ' + arr[i])
    }
  }
  var time_string = months + ' ' + day  + ' ' + year;
  var unix = Date.parse(time_string) / 1000;
  console.log ('unix = ' + unix)
  if(unix){
      var obj_string = { "unix": unix, "natural": time_string }
      return JSON.stringify(obj_string);
  }else{
    return null_obj
  }
}



  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var path_time =  +pathname.replace("/",""); 
    var path_time_string =  pathname.replace("/","").replace(",","").split('%');
    
    if (path_time > 0) {
        console.log("Request for " + pathname + " received.");
        response.writeHead(200, {"Content-Type": "text/plain"});
        console.log( timeConverter(path_time) );
        response.write( timeConverter(path_time) );
        response.end();
   } else if (path_time_string.length == 3) {
        console.log("Request for " + pathname + " received.");
        response.writeHead(200, {"Content-Type": "text/plain"});
        console.log( timeConvString(path_time_string) );
        response.write( timeConvString(path_time_string) );
        response.end();
   } else {
      console.log( null_obj );
      response.write( null_obj );
      response.end();
  }
    

  }

  http.createServer(onRequest).listen(process.env.PORT || 8080);
  console.log("Server has started.");


*/
