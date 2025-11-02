const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// write code to check is the username is valid
  const filteredUser = users.filter((user) => {
    return user.username === username;
  });

  if(filteredUser.length > 0){
    return true;
  }

  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
// write code to check if username and password match the one we have in records.
console.log("🚀 ~ authenticatedUser ~ users:", users)
  const filteredUser = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  
  if(filteredUser.length > 0){
    return true;
  }

  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if(authenticatedUser(username, password)) {
    // generate a jwt token
    let accessToken = jwt.sign({
     username: username
    }, 'access', {expiresIn: '1d'});

    req.session.authorization = {
      accessToken,username
    }

    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  if (!req.session || !req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({message: "User not authenticated"});
  }

  const isbn = req.params.isbn;
  const bookbyIsbn = books[isbn];
  const review = req.body.review;
  
  if (!review) {
    return res.status(400).json({message: "Review content is required"});
  }

  const username = req.session.authorization.username;
  
  if(bookbyIsbn){
    bookbyIsbn.reviews[username] = review;
    console.log("🚀 ~ bookbyIsbn:", bookbyIsbn.review);
    
    return res.status(200).json({message: "Review added/updated successfully"});
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
