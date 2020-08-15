const express = require('express')
const session = require('express-session')
const router = express.Router();
const connection = require('../models/db')

router.post('/login', (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    connection.query(
        'SELECT * FROM accounts WHERE username = ? AND password = ?',
        [username, password],
        (error, results) => {
            if (results.length > 0) {
                req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/');
            } else {
                res.send('Incorrect password or username');
            }
        }
    );
});


router.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.username = null;
    res.redirect('/');
});

module.exports = router