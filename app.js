const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose =require("mongoose");

const app = express();

mongoose.connect('mongodb+srv://sayantan-panda:test123@cluster0.axdyg.mongodb.net/PersonalBlog?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = mongoose.Schema({
    title: {
        type : String,
        required : [true,"Please specify the title!"]
    },
    content: {
        type : String,
        required : [true,"Empty post is useless!"]
    }
});

const post=mongoose.model("post",postSchema);

app.use(bodyParser.urlencoded("extended"));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    post.find((err,allPosts)=>{
        if(err)
            console.log(err);
        else{
            console.log("Successfully found all the posts");
            return res.render("home", { DayWiseArticles: allPosts });
        }
    });
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/contact", (req, res) => {
    res.render("contact");
});
app.get("/compose", (req, res) => {
    res.render("compose");
});
app.get("/posts/:postId", (req, res) => {

    const id = req.params.postId; 
    post.findOne({_id:id},(err,result)=>{
        if(err)
            console.log(err);
        else{
            console.log(result); 
            return res.render("posts", { showBlog: result});
        }
    });
});
app.post("/", (req, res) => {

    const newpost = {
        title: req.body.title,
        content: req.body.content
    };

    post.create(newpost,(err)=>{
        if(err)
           console.log(err);
        else{
            console.log("Successfully created new post");
            return res.redirect("/");
        }
    });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
})