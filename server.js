const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/journalDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  postDate: String,
  postTitle: String,
  postContent: String
})

const Post = mongoose.model("Post", postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    var flag = 0;
    if(posts.length == 0){
      flag = 1;
    }
   res.render("home", {

     posts: posts,
     flag: flag
     });
 })

})
app.get("/about", function(req, res){
  res.render("about.ejs");
})

app.get("/contact", function(req, res){
  res.render("contact.ejs");
})
app.get("/compose", function(req, res){
  res.render("compose.ejs");
})
app.post("/compose", function(req,res){
  let item = req.body.PostTitle;
  let postBody = req.body.PostContent;
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var today  = new Date();
  const postDate = today.toLocaleDateString("en-US", options);

  const post = new Post(
    {
      postDate: postDate,
      postTitle: item,
      postContent: postBody
    }
  );
  post.save(function(err){
   if (!err){
     console.log("success");
     res.redirect("/");
   }
 }
  );

})
app.get("/posts/:postId", function(req,res){
 const requestedPostId = req.params.postId;
 Post.findOne({_id: requestedPostId}, function(err, post){

   res.render("post", {
     postDate:post.postDate,
     postTitle: post.postTitle,
     postContent: post.postContent
   });

 });

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
