const express = require('express')
const session = require('express-session')
const router = express.Router();
const connection = require('../models/db')
const truncate = require('truncate');

// indexing methods
router.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM posts',
        (error, results) => {
            res.render('index.ejs', {posts: results, verified: req.session.loggedin, Truncate: truncate});
        }
    );
});


// login and register methods
router.get('/login', (req, res) => {
    if (req.session.loggedin)
    {
        res.redirect('/');
    } else {
        res.render('login.ejs', {verified: req.session.loggedin});
    }
});

module.exports = router