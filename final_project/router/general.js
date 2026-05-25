const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(409).json({message: "User already exists"});
  }

  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get all books - async callback
public_users.get('/', async function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN - Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({message: error}));
});

// Get book details based on author - async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(book =>
    book.author.toLowerCase().includes(author)
  );
  return res.status(200).json(result);
});

// Get all books based on title - async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(book =>
    book.title.toLowerCase().includes(title)
  );
  return res.status(200).json(result);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;