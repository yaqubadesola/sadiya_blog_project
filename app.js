const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const { render } = require('ejs');
const { urlencoded } = require('express');

const truncate = require('truncate');


// JSON SETTINGS
const sessionconfig = require('./config/session.json');
const dbconfig = require('./config/database.json');

const connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
});


app = express();
app.use(express.static('public'));
app.use(urlencoded({extended: false}));


// Session
// Change the session secret key later
app.use(session({
    secret: sessionconfig.secret,
    resave: sessionconfig.resave,
    saveUninitialized: sessionconfig.saveUninitialized
}));

// Login system
app.get('/login', (req, res) => {
    if (req.session.loggedin)
    {
        res.redirect('/');
    } else {
        res.render('login.ejs', {verified: req.session.loggedin});
    }
});


app.post('/auth', (req, res) => {

    var username = req.body.username;
    var password = req.body.username;
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


app.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.username = null;
    res.redirect('/');
});

app.get('/user', (req, res) => {
    if (req.session.loggedin) {
        res.send(req.session.username);
    } else {
        res.redirect('/login');
    }
});



// Index page
app.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM posts',
        (error, results) => {
            res.render('index.ejs', {posts: results, verified: req.session.loggedin, Truncate: truncate});
        }
    );
});

// Edit page
app.get('/edit/:id', (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.params.id],
            (error, results) => {
                res.render('edit.ejs', {post: results[0], verified: req.session.loggedin});
            }
        );
    }
});

app.post('/update/:id', (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [req.body.title, req.body.content, req.params.id],
            (error, results) => {
                res.redirect('/');
            }
        );
    }
});

// Delete
app.get('/delete/:id' , (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'DELETE FROM posts WHERE id = ?',
            [req.params.id],
            (error, results) => {
                res.redirect('/');
            }
        );
    } else {
        res.send('something went wrong !');
    }
});


app.get('/new', (req, res) => {
    
    if(req.session.loggedin) {
        res.render('new.ejs', {verified: req.session.loggedin});
    } else {
        res.redirect('/login');
    }
});

app.post('/new', (req, res) => {
    connection.query(
        'INSERT INTO posts(title, content, post_date) VALUES(?, ?, NOW())',
        [req.body.title, req.body.content],
        (error, results) => {
            res.redirect('/');
        }
    );
});

app.get('/post/:id', (req, res) => {
    connection.query(
        'SELECT * FROM posts WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.render('read.ejs', {post: results[0], verified: req.session.loggedin});
        }
    );
});



app.listen(3000);