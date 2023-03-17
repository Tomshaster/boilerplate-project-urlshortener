require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlParser = bodyParser.urlencoded({ extended: true });
const dns = require("dns");
const { log } = require("console");

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

app.get("/api/shorturl", function (req, res) {
  res.json({ really: "what were you expecting?" });
});

app.post("/api/shorturl", urlParser, async function (req, res) {
  if (!req.body || req.body.url.split("/")[2] == undefined)
    res.json({ error: "invalid URL" });
  dns.lookup(req.body.url.split("/")[2], (err, add, fam) => {
    // console.log(err);

    if (err) {
      res.json({ error: "invalid URL" });
    } else {
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
            if (err) {
              shortLinks.findOne(
                { original_url: req.body.url },
                (err, data) => {
                  res.json(data);
                }
              );
            } else {
              res.json(link);
            }
          });
        }
      });
    }
  });
  // console.log(req.body);
  // res.json(req.body.url);
});

app.get("/api/shorturl/:linkId", async function (req, res) {
  const id = req.params.linkId;
  shortLinks.findOne({ short_url: id }, (err, data) => {
    data
      ? res.redirect(data.original_url)
      : res.json({ error: "No short URL found for the given input" });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
