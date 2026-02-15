const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const doesExist = require("./auth_users.js").doesExist;

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!doesExist(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({nessage: "User successully registered. Now you can login."});
    }else{
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(300).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  let booksAuthor = [];
  bookKeys.forEach(key => {
    if(books[key].author === author){
      booksAuthor.push(books[key]);
    }
  });
  if (booksAuthor.length > 0){
    return res.status(200).send(JSON.stringify(booksAuthor, null, 4))
  }else{
    return res.status(404).json({message: 'Author does not exists'})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);

  let booksTitle = [];
  bookKeys.forEach(key => {
    if(books[key].title === title){
      booksTitle.push(books[key]);
    }
  });
  if (booksTitle.length > 0){
    return res.status(200).send(JSON.stringify(booksTitle, null, 4))
  }else{
    return res.status(404).json({message: 'Book does not exists'})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Get ISBN from the URL
  const book = books[isbn];    // Find the book in your data

  if (book) {
    // Return only the reviews property of the book
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    // Handle the case where the ISBN doesn't exist
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
