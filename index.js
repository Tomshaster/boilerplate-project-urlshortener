require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlParser = bodyParser.urlencoded({ extended: true });

// Basic Configuration
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const shortLinkSchema = new mongoose.Schema({
  original_url: { type: String, unique: true },
  short_url: { type: String },
});

const shortLinks = mongoose.model("shortLink", shortLinkSchema);

shortLinks.remove({}, (err) => (err ? console.log(err) : null));

// shortLinks.countDocuments(null, (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     let shortened = data + 1;

//     let test1 = new shortLinks({
//       original_url: "asda",
//       short_url: shortened,
//     });

//     shortened = shortened + 1;

//     let test2 = new shortLinks({
//       original_url: "123123",
//       short_url: shortened,
//     });

//     shortened = shortened + 1;

//     let test3 = new shortLinks({
//       original_url: "asda123",
//       short_url: shortened,
//     });

//     test1.save((err) => {
//       err ? console.log(err) : null;
//     });
//     test2.save((err) => {
//       err ? console.log(err) : null;
//     });
//     test3.save((err) => {
//       err ? console.log(err) : null;
//     });
//   }
// });

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", urlParser, function (req, res) {
  shortLinks.countDocuments(null, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let shortened = data + 1;

      let link = new shortLinks({
        original_url: req.body.url,
        short_url: shortened,
      });
      link.save((err) => {
        err ? console.log(err) : null;
      });
      res.json(link);
    }
  });
  // console.log(req.body);
  // res.json(req.body.url);
});

app.get("/api/shorturl/:linkId", function (req, res) {});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
