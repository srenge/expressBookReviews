const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!users.find((user) => user.username === username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Please provide username and password" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here  
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ book: books[isbn] });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => book.author === author);
  return res.status(200).json({ books: booksByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) => book.title === title);
  return res.status(200).json({ books: booksByTitle });
});


//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
