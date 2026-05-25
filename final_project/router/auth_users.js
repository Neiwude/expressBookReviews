const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username,password)) {

    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({message: "Customer successfully logged in."});
  }

  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

 return res.status(200).json({
  message: "Review added/updated successfully",
  reviews: books[isbn].reviews
});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
