// Requires "request" to be installed (see https://www.npmjs.com/package/request)
var request = require('request');
var fs = require('fs');
var express = require("express");
var bodyParser = require('body-parser');
let path = require('path');
let cors = require('cors');
import { v4 as uuidv4 } from 'uuid';
var app = express();
app.use(cors);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const port = 4001;
const server = require('http').createServer(app);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
// # https://www.remove.bg/example.jpg
app.post("/api/remove-bg",function(req,res){
    console.log(req.body.imageUrl);
    request.post({
        url: 'https://api.remove.bg/v1.0/removebg',
        formData: {
          image_url: req.body.imageUrl,
          size: 'auto',
        },
        headers: {
          'X-Api-Key': '9EdDasvh5GFn8UFUb7h9dpLD'
        },
        encoding: null
      }, function(error, response, body) {
        if(error) return console.error('Request failed:', error);
        if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
        const imageName = uuidv4();
        fs.writeFileSync(`public/${imageName}.png`, body);
        return res.send({msg:"Removed Successfully","imageNBPath":`${imageName}.png`});
      });    
    
});
server.listen(port, () => {
    console.log('Server listening on port: ', port);
}).timeout = 1800000; //30 min