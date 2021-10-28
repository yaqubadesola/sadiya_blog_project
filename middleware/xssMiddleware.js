// Cross Site Scripting Protection Implementation
//Inorder to avoid Cross site Scripting issues and ensure optimum protection
// from the clientside, User's input must be validated and ensure required data are entered
const validator = require('../validator');

const register = (req, res, next) => {
    const validationRule = {
        "email": "required|email",
        "username": "required|string|min:6",
        "password": "required|string|min:6",
    }
    validator(req.body, validationRule, {}, (error, status) => {
        if (!status) {
            const registrationErrors = Object.keys(error.errors).map(key => error.errors[key]);
            req.flash("registrationErrors", registrationErrors)
            res.status(412)
                .redirect("/user/register");
        } else {
            next();
        }
    });
}

const login = (req, res, next) => {
    const validationRule = {
        "username": "required|string|min:6",
        "password": "required|string|min:6",
    }
    validator(req.body, validationRule, {}, (error, status) => {
        if (!status) {
            const loginErrors = Object.keys(error.errors).map(key => error.errors[key]);
            req.flash("loginErrors", loginErrors)
            res.status(412)
                .redirect("/user/login");
        } else {
            next();
        }
    });
}



const blogPost = (req, res, next) => {
    const validationRule = {
        "title": "required|string",
        "description": "required|string|min:10",
        "content": "required|string|min:50",
    }
    validator(req.body, validationRule, {}, (error, status) => {
        if (!status) {
            const postErrors = Object.keys(error.errors).map(key => error.errors[key]);
            req.flash("postErrors", postErrors)
            res.status(412)
                .redirect("/post/create");
        } else {
            next();
        }
    });
}

module.exports = {
    register, login, blogPost
}