const session = require('express-session')
const connection = require('../models/db')
const bcrypt = require('bcrypt')

//Note SQL Injection 
// In the query string, I tweaked the code so any user input is automatically escaped
// before being executed.With MySQL, you can specify which variables get escaped within
// the query() method itself by introducing a placeholder 

exports.register = async (req, res) => {

    var registrationErrors = []
    if (!req.body.username) {
        let message = "Please provide a username"
        registrationErrors.push(message)
    }

    if (!req.body.email) {
        let message = "Please provide a emali"
        registrationErrors.push(message)
    }

    if (!req.body.password) {
        let message = "Please provide a password"
        registrationErrors.push(message)
    }
    if (!req.body.username || !req.body.email || !req.body.password) {
        req.flash("registrationErrors", registrationErrors)
        return res.redirect("/user/register")
    }
    const saltRounds = 10
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: encryptedPassword
    }

    connection.query(
        'INSERT INTO accounts set ?',
        newUser,
        (error, results) => {
            if (results) {
                req.flash('success_msg', 'You have successfully registered, Login with your credentials.');
                res.redirect('/user/login');
            } else {
                //const registrationErrors = Object.keys(error.errors).map(key => error.errors[key].sqlMessage);
                req.flash('registrationErrors', error.message)
                res.redirect('/user/register');

            }
        }
    );
}


exports.login = (req, res, next) => {
    var loginErrors = []
    if (!req.body.username) {
        let message = "Please provide a username"
        loginErrors.push(message)
    }

    if (!req.body.password) {
        let message = "Please provide a password"
        loginErrors.push(message)
    }
    if (!req.body.username || !req.body.password) {
        console.log(loginErrors)
        req.flash("loginErrors", loginErrors)
        return res.redirect("/user/login")
    }
    var username = req.body.username;
    var password = req.body.password;
    connection.query(
        'SELECT * FROM accounts WHERE username = ?',
        [username],
        async (error, result) => {
            if (error) {
                //console.log("error ", error)
                req.flash("loginErrors", error.message);
                return res.redirect("/user/login")
            }

            if (result) {
                const comparison = await bcrypt.compare(password, result[0].password)
                if (result.length > 0 && comparison) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.on('finish', function () {
                        res.locals.username = req.session.username
                        res.locals.loggedin = req.session.loggedin
                        next()
                    });
                    return res.redirect('/');
                }
                else {
                    req.flash("loginErrors", "Incorrect password or username")
                    return res.redirect("/user/login")
                }

            }
            else {
                req.flash("loginErrors", "User Accout's could not be fetched")
                return res.redirect("/user/login")
            }
            //res.send('Incorrect password or username');

        }

    );
}

exports.logout = (req, res) => {
    // req.session.loggedin = false;
    // req.session.username = null;
    // res.redirect('/');
    let sess = req.session;
    sess.destroy(function (err) {
        if (err) {
            console.log('Error destroying session');
            //res.json(data);
        } else {
            console.log('Session destroyed successfully');
            //res.redirect("/login");
        }
    });
    res.redirect('/');
}