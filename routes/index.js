const fs = require('fs');
const express = require('express');
const router = express.Router();
const users = require('../model');

 router.post('/book', (req, res) => {
 
  const userName = req.body.userName;
  const userid = req.body.userid;
  const bookName = req.body.bookName;
  const author = req.body.author;
  const issueDate = req.body.issueDate;
  const returnDate = req.body.returnDate;
  const isbn = req.body.isbn;
  const status = req.body.status;
  
  
  if (!userName || !userid || !bookName || !author || !issueDate || !returnDate || !isbn || !status) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  if (typeof userName !== 'string' || typeof userid !== 'number' || typeof bookName !== 'string' || typeof author !== 'string' || typeof issueDate !== 'string' || typeof returnDate !== 'string' || typeof isbn !== 'string' || typeof status !== 'string') {
    res.status(400).json({ message: 'Invalid data type' });
    return;
  }

  if (status !== 'Available' && status !== 'Not-Available' && status !== 'Hold') {
    res.status(400).json({ message: 'Invalid status value' });
    return;
  }
  
  const user = { userName, userid, bookName, author, issueDate, returnDate, isbn, status };
  users.push(user);

  fs.writeFile('./book.json', JSON.stringify(users), (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ message: 'Data created successfully' });
    }
  });
}); 
 
router.get('/listbooks', (req, res) => {
    fs.readFile('./book.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            students = JSON.parse(data);
            let bookList = '';
            users.forEach((user) => {
                bookList += `<tr><td>${user.userName}</td><td>${user.userid}</td><td>${user.bookName}</td><td>${user.author}</td><td>${user.issueDate}</td><td>${user.returnDate}</td><td>${user.isbn}</td><td>${user.status}</td></tr>`;
            });
            let indexHtml = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>Books List</title>
                </head>
                <body>
                  <h1>BOOKS LIST</h1>
                  <table  border="1">
                    <thead>
                      <tr>
                      <th>UserName</th>
                      <th>UserID</th>
                      <th>BookName</th>
                      <th>Author</th>
                      <th>IssueDate</th>
                      <th>ReturnDate</th>
                      <th>ISBN</th>
                      <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>${bookList}</tbody>
                  </table>
                </body>
              </html>
            `;
            res.send(indexHtml);
        }
    });
});

router.get('/books/:status', (req, res) => {
    const { status } = req.params;
    const BooksBasedonStatus = users.filter(book => book.status === status);
    let bookList = '';
    if (BooksBasedonStatus.length) {
        bookList += `<tr><td>${BooksBasedonStatus.userName}</td><td>${BooksBasedonStatus.userid}</td><td>${BooksBasedonStatus.bookName}</td><td>${BooksBasedonStatus.author}</td><td>${BooksBasedonStatus.issueDate}</td><td>${BooksBasedonStatus.returnDate}</td><td>${BooksBasedonStatus.isbn}</td><td>${BooksBasedonStatus.status}</td></tr>`;
        let bookDetails = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Books List</title>
          </head>
          <body>
            <h1>${users.bookName}</h1>
            <table border="1>
              <thead>
                <tr>
                  <th>UserName</th>
                  <th>UserID</th>
                  <th>BookName</th>
                  <th>Author</th>
                  <th>IssueDate</th>
                  <th>ReturnDate</th>
                  <th>ISBN</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${bookList}</tbody>
            </table>
          </body>
        </html>
      `;
        res.send(bookDetails);
    } else {
        res.status(404).json({ message: 'Status not found' });
    }
}
);

router.get('/book/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('./book.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const users = JSON.parse(data);
            const user = users.find(user => user.userid === id);
            let bookList = '';
            if (user) {
                bookList += `<tr><td>${user.userName}</td><td>${user.userid}</td><td>${user.bookName}</td><td>${user.author}</td><td>${user.issueDate}</td><td>${user.returnDate}</td><td>${user.isbn}</td><td>${user.status}</td></tr>`;
                let bookDetails = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Books List</title>
              </head>
              <body>
                <h1>${user.bookName}</h1>
                <table border="1>
                  <thead>
                    <tr>
                      <th>UserName</th>
                      <th>UserID</th>
                      <th>BookName</th>
                      <th>Author</th>
                      <th>IssueDate</th>
                      <th>ReturnDate</th>
                      <th>ISBN</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>${bookList}</tbody>
                </table>
              </body>
            </html>
          `;
                res.send(bookDetails);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    });
});

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let newData = req.body;
    let index = users.findIndex(obj => obj.userid == id);
    if (index !== -1) {
        users[index] = { ...users[index], ...newData };
        res.status(200).json(users[index]);
    } else {
        res.status(404).json({ message: "Object not found" });
    }
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let index = users.findIndex(obj => obj.userid == id);
    if (index !== -1) {
        users.splice(index, 1);
        res.status(200).json({ message: "Object deleted successfully" });
    } else {
        res.status(404).json({ message: "Object not found" });
    }
});

module.exports = router;