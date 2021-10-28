const express = require('express');
const session = require('express-session');
const configOption = require('./config/database.json');
const { urlencoded } = require('express');
const fileUpload = require('express-fileupload');
const { engine } = require('express-edge');// template engine
const connectFlash = require('connect-flash')
const MySQLStore = require('express-mysql-session')(session);



const sessionMiddleware = require('./middleware/sessionMiddleware')
app = express();
app.use(express.static('public'));
app.use(urlencoded({ extended: false }));
app.use(engine);

// JSON SETTINGS
const sessionconfig = require('./config/session.json');
const connection = require('./models/db')


//This part catered for Session Hijacking by saving the active user into server side 
//It identifies unique sessions of user that logged in, Note that at the point of log in we assign user to session

//The session account remains enumerated until the user is logged out
//with this design approach it would not be possible to hijack user's session account
const sessionStore = new MySQLStore(configOption);
app.use(session({
    secret: sessionconfig.secret,
    resave: sessionconfig.resave,
    store: sessionStore,
    saveUninitialized: sessionconfig.saveUninitialized
}));

app.use(fileUpload())
app.use(sessionMiddleware)
app.use(connectFlash())
// Routers
let router = require('./routes/index')
let authRouter = require('./routes/auth')
let profileRouter = require('./routes/profile')



app.use('/', router) // index router {index, login, register pages}
app.use('/auth', authRouter) // auth router
app.use('/profile', profileRouter) // profile router

app.listen(process.env.PORT || 3000);
