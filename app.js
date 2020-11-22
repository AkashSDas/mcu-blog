const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  flash = require("express-flash"),
  configDB = require("./config/database.js"),
  Blog = require("./models/blogs.js"),
  port = 3000,
  host = "localhost";

// Connecting to the database
mongoose
  .connect(configDB.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`Error:\n${err.message}`);
  });

// Setting up our express app
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// app.use(flash());

app.set("view engine", "ejs");

// ===================
// Routes
// ===================

// ROOT Route
app.get("/", (req, res) => {
  res.redirect("/blogs/");
});

// INDEX Route
app.get("/blogs/", (req, res) => {
  Blog.find((err, blogs) => {
    if (err) {
      console.log(`Error: \n${err}`);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// NEW Route
app.get("/blogs/new/", (req, res) => {
  res.render("new");
});

// CREATE Route
app.post("/blogs/", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      console.log(`Error: \n${err}`);
      res.render("new");
    } else {
      res.redirect("/blogs/");
    }
  });
});

// SHOW Route
app.get("/blogs/:id/", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      console.log(`Error: \n${err}`);
      res.redirect("/blogs/");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// EDIT Route
app.get("/blogs/:id/edit/", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      console.log(`Error: \n${err}`);
      res.redirect("/blogs/");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

// UPDATE Route
app.put("/blogs/:id/", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateddBlog) => {
    if (err) {
      console.log(`Error: \n${err}`);
      res.redirect("/blogs/");
    } else {
      res.redirect(`/blogs/${req.params.id}/`);
    }
  });
});

// DESTORY Route
app.delete("/blogs/:id/", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(`Error: \n${err}`);
      res.redirect("/blogs/");
    } else {
      res.redirect("/blogs/");
    }
  });
});

// Are you listening?
app.listen(port, host, () => {
  console.log(`Server has started on http://${host}:${port}/`);
});
