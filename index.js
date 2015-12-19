'use strict'
const express = require('express');
const path = require('path');
const app = express();
const BodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID;
const fs = require('fs')
const async = require('async')
const Memcached = require('memcached')
const crypto = require('crypto');
const request = require('request');
var memcached = new Memcached('localhost:11211');

app.use(BodyParser.json());
app.use(express.static('./built'));
app.use(express.static('./bower_components'));
var dbInstance = null;
var dbUrl = 'mongodb://localhost:27017/Spider';
mongodb.MongoClient.connect(dbUrl, function (err, db) {
  if(err) throw err;
  dbInstance = db
})

function getDbData(id, cb){
  var cursor = dbInstance.collection('page').find({"_id": ObjectId(id)}, {"_id": true, "title":true, "loc":true, "text":true})
  cursor.each(function(err, doc) {
    if(err) cb(err);
    else {
      if(doc!=null){
        cb(null, doc)
      }
    }
  });

}

function getList(key, dataFn, cb){
  var callbackFn = function (data){
    // memcached.set(key, JSON.stringify(data), 300, function(err){console.log(err)});
    cb(null, data)
  }
  memcached.get(key, function(err, data){
    if(err) cb(err)
    else{
      if(data) {
        cb(null, JSON.parse(data))
      }else{
        dataFn(callbackFn)
      }
    }
  })
}

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join('./')
  })
});

app.get('/s/:query', function(req, res){




  var keywords = req.params.query
  var page = req.query.page || 1
  var cache_key = keywords + '__page=' + page
  let timer = Date.now()
  var digest = crypto.createHash('md5')
  digest.update(cache_key)
  var hash = digest.digest('hex')
  getList(hash, function (cb){
    console.log('缓存未命中，请求数据...')
    console.log(keywords)
    request.get({
      url: 'http://172.27.35.7:8080/MySearch/Query?query=' + keywords,
      timeout: 5000
    }, function (err, t, res){
      if(err) {
        cb({count: 0, data: []})
      }else {
        console.log(res.body)
        console.log('!!!')
        let obj = JSON.parse(res.body)
        if(obj.length > 0){
          let start = (page-1)*30;
          let objCurrentPage = obj.slice(start, start + 30)
          async.map(objCurrentPage, getDbData, function(err, result){
            if(err){console.log(err)}
            cb({count: obj.length, data:result})
          })
        }else {
          cb({count: 0, data: []})
        }
        
      }



    })

  }, function (err, result){
    result.time = Date.now() - timer
    res.json(result)
  })

});
app.get('/data', function (req, res){
  fs.readFile('data.json', function (err, data){
    let jsonStr = data.toString()
    let obj = JSON.parse(jsonStr)
    res.json(obj)
  })
})

app.listen(3000, function (){
  console.log("爬虫服务器已启动,端口:3000");
});
