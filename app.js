var createError = require('http-errors');
var express = require('express');
var path = require('path');
const { sequelize } = require('./models')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/posts');
var authRouter = require('./routes/auth');


var app = express();

// Load environment variables from .env
require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

/*****************Custom Middleware**************** */
// custom middleware logger
app.use(logger);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// Cross Origin Resource Sharing
// app.use(cors(corsOptions)); // ON PRODUCTION
app.use(cors());

/*****************Default Middleware**************** */
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json 
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);



// all routes below this will use jwt middleware
app.use(verifyJWT);
app.use('/users', usersRouter);
app.use('/posts', postRouter);


app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});
// error handler
app.use(errorHandler);


// Sync sequlize models with tables in db
async function main(){
  await sequelize.authenticate()
  console.log("Database connected !")
}
main()

module.exports = app;
