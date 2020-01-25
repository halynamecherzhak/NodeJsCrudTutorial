const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "users",
  password: ""
});

//handlebars
app.set("view engine", "hbs");

// get list of users
app.get("/", function(req, res) {
  pool.query("SELECT * FROM user", function(err, data) {
    if (err) {
      return console.log(err);
    }
    res.render("index.hbs", {
      users: data
    });
  });
});

app.get("/create", function(req, res) {
  res.render("create.hbs");
});

app.post("/create", urlencodedParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  pool.query(
    "INSERT INTO user (username,email,password) VALUES (?,?,?)",
    [username, email, password],
    function(err, data) {
      if (err) {
        return console.log(err);
      }
      res.redirect("/");
    }
  );
});

app.get("/edit/:id", function(req, res) {
  const id = req.params.id;
  pool.query("SELECT * FROM user WHERE id=?", [id], function(err, data) {
    if (err) {
      return console.log(err);
    }
    res.render("edit.hbs", {
      user: data[0]
    });
  });
});

app.post("/edit", urlencodedParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const id = req.body.id;

  pool.query(
    "UPDATE user SET username=?, email=?, password=? WHERE id=?",
    [username, email, password, id],
    function(err, data) {
      if (err) {
        return console.log(err);
      }
      res.redirect("/");
    }
  );
});

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function(req, res) {
  const id = req.params.id;
  pool.query("DELETE FROM user WHERE id=?", [id], function(err, data) {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

app.listen(3000, function() {
  console.log("Server started listening...");
});
