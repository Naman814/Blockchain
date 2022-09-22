const https = require('https');
const express = require('express');
const path = require('path');
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use('/public',express.static('public'));

const lib = require('../public/js/implement');

const hbs = require('hbs');

const viewPath=path.join(__dirname,'../templates/views')
app.set('view engine', 'hbs')
app.set('views',viewPath)


app.get('/',function(req,res){
  
  res.sendFile(__dirname+"/home.html");
});

app.get('/register',function(req,res){
    res.sendFile(__dirname+"/register.html");
})

app.post('/register',function(req,res){
  const blockNum = req.body.blockno;
  const time = req.body.timestamp;
  const name = req.body.name;
  const phone = req.body.phone;
  const heartRate = req.body.rate;
  const pressure = req.body.pressure;
  const gender = req.body.gender;

  lib.coin.addBlock(new lib.Block(blockNum, time , {Name :  name , phone:phone , heartRate: heartRate,pressure : pressure,gender:gender}));
  console.log("Mining block : "+blockNum);
  res.sendFile(__dirname+'/blockstatus.html');

});

app.get('/display',function(req,res){
    res.send(JSON.stringify(lib.coin , null , 6));
})


app.post('/isvalid',function(req,res){
    
    if(lib.coin.isValid()) {
        res.sendFile(__dirname+'/isvalid.html');
    }
    else{
        res.send("Warning, Blockchain Invalid");
    }
});


app.get('/latestblock',function(req,res){
    var func = lib.coin.getLatestBlock();
    const idx  = func.index;
    const time = func.timestamp;
    const data = func.data;
    const prevHash = func.previousHash;
    const nonce = func.nonce;
    const hash = func.hash;

    res.render('latestBlock',{
      index:idx,
      timestamp:time,
      data:data,
      previousHash:prevHash,
      nonce:nonce,
      hash:hash
    })
})


app.listen(3000,function(){
  console.log("server is running on port 3000");
});
