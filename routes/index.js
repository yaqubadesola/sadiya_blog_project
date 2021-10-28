const express = require('express')
const router = express.Router();
const validator = require("../middleware/xssMiddleware")
//Require all middlewares
//const authenticate = require('../middleware/authenticate')
//const sessionMiddleware = require('./middleware/sessionMiddleware')

// the indexController
const indexController = require('../controllers/index')

// indexing methods
router.get('/', indexController.index);


// login  method to get login template
router.get('/user/login', indexController.login);

//register method to get registration page
router.get("/user/register", indexController.register);

// administration pages
// Edit page
router.get('/edit/:id', indexController.edit);
router.post('/update/:id', indexController.update);

// Delete
router.get('/delete/:id', indexController.delete);


router.get('/post/create', indexController.new_get);

router.post('/post/store', validator.blogPost, indexController.new_post);

router.get('/post/:id', indexController.post);

module.exports = router