require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const urlParser = bodyParser.urlencoded({ extended: true })

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', urlParser, function(req, res) {
  console.log(req.body)
  res.json({body: req.body})
})

app.get('/api/shorturl/:linkId', function(req, res){
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
