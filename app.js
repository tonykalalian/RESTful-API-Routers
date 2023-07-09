const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);
app.get("/", (req, res) => {
  res.send("Hello");
});

app
  .route("/article")
  .get((req, res) => {
    Article.find({})
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => {
        res.send("Successfully added a new article");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then(() => {
        res.send("Successfully deleted all articles");
      })
      .catch((err) => {
        res.send(err);
      });
  });
app
  .route("/article/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        res.send(foundArticle);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .put((req, res) => {
    Article.updateOne({ overWrite: true })
      .then(() => {
        res.send("Successfully updated the article");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
      .then(() => {
        res.send("Successfully updated the article");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    const articleId = req.params.id;
    Article.findByIdAndDelete(articleId)
      .then(() => {
        res.send("Successfully deleted the article");
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.listen(3000, (req, res) => {
  console.log("Our app is running on port 3000");
});
