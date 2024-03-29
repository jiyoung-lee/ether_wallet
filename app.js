const createError = require('http-errors');
const express = require('express');
const path = require('path');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const createRouter = require('./routes/create');
const mainRouter = require('./routes/main');
const sendRouter = require('./routes/send');
const privatekeyRouter = require('./routes/privatekey');

const db = require('./db/db_info')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'asadlfkj!@#',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(db.info)
}));
app.use(logger('dev'));
app.use('/', indexRouter);
app.use('/create', createRouter);
app.use('/main', mainRouter);
app.use('/send', sendRouter);
app.use('/privatekey', privatekeyRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('err', {title: 'err'});
});

module.exports = app;
