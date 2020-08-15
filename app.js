const express = require('express');
const session = require('express-session');
const { render } = require('ejs');
const { urlencoded } = require('express');

app = express();
app.use(express.static('public'));
app.use(urlencoded({extended: false}));

// JSON SETTINGS
const sessionconfig = require('./config/session.json');
const connection = require('./models/db')


// Session
// Change the session secret key later
app.use(session({
    secret: sessionconfig.secret,
    resave: sessionconfig.resave,
    saveUninitialized: sessionconfig.saveUninitialized
}));

// Routers
let router = require('./routes/index')
let authRouter = require('./routes/auth')
let profileRouter = require('./routes/profile')

app.use('/', router) // index router {index, login, register pages}
app.use('/auth', authRouter) // auth router
app.use('/profile', profileRouter) // profile router


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

app.listen(process.env.PORT || 3000);
