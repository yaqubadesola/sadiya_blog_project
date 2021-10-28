//const session = require('express-session')
const connection = require('../models/db')
const truncate = require('truncate');
const path = require('path');
// index page
exports.index = (req, res) => {
    console.log("res locals ", res.locals)
    connection.query(
        'SELECT * FROM posts',
        (error, results) => {
            res.render('index', { posts: results, verified: req.session.loggedin, Truncate: truncate });
        }
    );
}

// login and register
exports.login = (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
    } else {
        res.render('user_login', { errors: req.flash("loginErrors"), message: req.flash("success_msg"), verified: req.session.loggedin });
    }
}

exports.register = (req, res) => {
    res.render("user_register", { errors: req.flash("registrationErrors") })
}

// admin edit blog post
exports.edit = (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.params.id],
            (error, results) => {
                res.render('edit.ejs', { post: results[0], verified: req.session.loggedin });
            }
        );
    }
}

// Update method for /edit page
exports.update = (req, res) => {
    if (req.session.loggedin) {
        connection.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [req.body.title, req.body.content, req.params.id],
            (error, results) => {
                res.redirect('/');
            }
        );
    }
}

// delete
exports.delete = (req, res) => {
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
}

// new blog (get)
exports.new_get = (req, res) => {

    if (req.session.loggedin) {

        res.render('create', { errors: req.flash("postErrors"), verified: req.session.loggedin });
    } else {
        res.redirect('/user/login');
    }
}

// new blog (post)
exports.new_post = (req, res) => {
    const { image } = req.files
    image.mv(path.resolve(__dirname, "..", 'public/posts', image.name), (error) => {
        req.body = { ...req.body, image: `posts/${image.name}` }
        connection.query(
            'INSERT INTO posts(title, description, content, image, created_at) VALUES(?, ?, ?, ?, NOW())',
            [req.body.title, req.body.description, req.body.content, req.body.image],
            (error, results) => {
                if (error)
                    console.log(error.message)
                res.redirect('/');
            }
        );
    })

}

// viewing the post
exports.post = (req, res) => {
    connection.query(
        'SELECT * FROM posts WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.render('post', { post: results[0], verified: req.session.loggedin });
        }
    );
}