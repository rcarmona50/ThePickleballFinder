if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
//const mongoSanitize = require('express-mongo-sanitize')
const User = require('./models/user')

const MongoDBStore = require('connect-mongo')(session);
const courtRoutes = require('./routes/courts')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users');


// TO DEPOLY
const dbUrl = process.env.DB_URL;

// LOCAL DEVELOPMENT
//const dbUrl= 'mongodb://localhost:27017/pickleball-finder';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
 
// Set EJS
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
//app.use(mongoSanitize)
const secret = process.env.SECRET;

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/', userRoutes)
app.use('/courts', courtRoutes)
app.use('/courts/:id/reviews', reviewRoutes)

// Home Page
app.get('/', (req, res)=>{
    res.render('home')
})

app.all('*' , (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})

// Error Handling
app.use((err, req, res, next)=> {
    const{ statusCode = 500} = err;
    if(!err.message) err.message= 'Something is wrong'
    res.status(statusCode).render('error', { err })
})

// Listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log('Serving on port 3000')
})