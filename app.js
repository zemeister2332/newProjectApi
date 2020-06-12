const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const mdb = require('./cf/db');

// APP.JS INIT
const app = express();

// BOdyParser INIT
app.use(bodyParser.urlencoded({ extended: true }))

// PARSE JSON FORMATS
app.use(bodyParser.json())

// MUSIC MODEL IMPORT
const Music = require('./model/Music');

// MONGO DB CONNECTION
mongoose.connect( mdb.db,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = mongoose.connection;
// IF OPEN
db.once('open', () => {
    console.log("Mongo Db BOglandi");
});
// IF ERROR
db.on('error', (err) => {
    console.log("Mongo Db Xatosi",err);
});

// STATIC PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// STATIC FOLDERS
app.use(express.static(path.join(__dirname, 'public')));

// FOR NAVIGATION MESSAGES

// EXPRESS_MESSAGES
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// EXPRESS_SESSION
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

// EXPRESS_VALIDATOR
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));
// Passport CF
require('./cf/passport')(passport);
// Passport use
app.use(passport.initialize());
app.use(passport.session());

// user init
app.get('*', (req,res,next) => {
    res.locals.user = req.user || null;
    next();
});

// Bosh Sahifa Routi
app.get('/', (request,response) => {
    Music.find({}, (err, musics) => {
        if (err){
            console.log(err);
        } else{
            response.render('index', {
                title: 'Musiqalar',
                musics: musics
            })
        }
    });

});

const musics = require('./routes/musics');
app.use('/', musics);
const users = require('./routes/users');
app.use('/', users);

app.listen(3000, () => {
    console.log("3000 Porti Tinglashni boshladi!!!");
});