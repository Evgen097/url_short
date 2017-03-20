// note_routes.js
var ObjectID = require('mongodb').ObjectID;
var server_url = "https://myurlshort.herokuapp.com/new/";
module.exports = function(app, db) {
  app.get('/new/', (req, res) => {
        console.log('hello');
        res.send('hello');
  });
  app.get('/', (req, res) => {
        console.log('hello');
        res.send('hello');
  });
  
  app.get('^/new/[0-9]*/', (req, res) => {
    var url_short = +req.url.slice(5);
    //console.log( +req.url.slice(5) )
    var notes_collection = db.collection('notes');
    notes_collection.find({
        short_url: url_short
      })
      .toArray(function(err, docs) {
        if (err) throw err
        if(docs.length==0){
            //console.log( 'hello1' )
            res.send( JSON.stringify({"error":"This url is not on the database."}) );
        }else{
            //console.log( docs )
            //console.log(docs[0].long_url)
            res.writeHead(301,{Location: docs[0].long_url});
            res.end(  );
        }
      })
            
    //console.log(docs[0].long_url)
    //res.writeHead(301,{Location: 'https://translate.yandex.ru'});
    //res.end(  );
    
  });
  
  app.get('^/new/https?://[a-zA-Z0-9_]*.[a-z]*/', (req, res) => {
    var url_long = req.url.slice(5);
    //console.log( req.url.slice(5) )

      var notes_collection = db.collection('notes');

      notes_collection.find({
        long_url: url_long
      }).toArray(function(err, docs) {
        if (err) throw err
        if(docs.length==0){
            notes_collection.aggregate([
                { $match: {}}
              , { $group: {
                  _id: '$url_list'
                , maxQuantity: {
                    $max: '$short_url'
                  }
                }}
              ]).toArray(function(err, results) {
                if (err) throw err
                if (!results.length) {
                  throw new Error('No results found')
                }
                var max_short_url = results[0].maxQuantity + 1;
                //console.log(results)
                //console.log(typeof max_short_url)
                //console.log(max_short_url)
                const note = { 'short_url': max_short_url, 'long_url': url_long, name: "url_list" };
                
                db.collection('notes').insert(note, (err, result) => {
                if (err) { 
                   res.send({ 'error': 'An error has occurred' }); 
                } else {
                  
                    var obj = { "original_url":url_long, "short_url":server_url+ max_short_url }
                    //var obj = { "original_url":url_long, "short_url":"https://api-progects-evgenkaban.c9users.io/new/"+ max_short_url }

                    res.send( JSON.stringify(obj) );
                }
                });
              })
        }else{
          const note = { 'short_url': server_url+ docs[0].short_url, 'original_url': docs[0].long_url };
          //console.log( JSON.stringify(note) )
          res.send( JSON.stringify(note) );
            //console.log(docs[0].long_url)
            //res.writeHead(301,{Location: 'https://translate.yandex.ru'});
            //res.end(  );
        }
      })
  });
  
    

  app.get('/new/:id', (req, res) => {
    var url = req.params.id;
    console.log( url.pathname )
      //console.log(req);

    console.log(req.params.id);
    //console.log(req.body.title);
    if (+req.params.id>0){
        console.log('its a number');
        res.send('its a number');

    }else{
      var notes_collection = db.collection('notes');

      notes_collection.find({
        long_url: req.params.id
      }).toArray(function(err, docs) {
        if (err) throw err
        if(docs.length==0){
            notes_collection.aggregate([
                { $match: {}}
              , { $group: {
                  _id: '$short_url'
                , maxQuantity: {
                    $max: '$short_url'
                  }
                }}
              ]).toArray(function(err, results) {
                if (err) throw err
                if (!results.length) {
                  throw new Error('No results found')
                }
                var max_short_url = results[0].maxQuantity
                
                const note = { short_url: max_short_url+1, long_url: req.params.id };
                
                db.collection('notes').insert(note, (err, result) => {
                if (err) { 
                   res.send({ 'error': 'An error has occurred' }); 
                } else {
                    res.send(result.ops[0]);
                }
                });
              })
        }else{
            console.log(docs[0].long_url)
            res.send( JSON.stringify(docs[0].long_url) );
        }
      })
    }
  });
  
    
  app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('We are live on app.get(/notes/:id)');
        console.log(item);
        res.send(item);
      }
    });
  });
  
  
  app.post('/notes', (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  
  
  app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + id + ' deleted!');
      } 
    });
  });
  
  
  app.put ('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').update(details, note, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(note);
      } 
    });
  });
};



/*
  app.get('/', (req, res) => {
    console.log('We are live on ');
    res.send('We are live on ');
  });
*/