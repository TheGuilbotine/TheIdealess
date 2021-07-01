const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const accountRouter = require('./routes/account');
const demoRouter = require('./routes/demo');
const logoutRouter = require('./routes/logout');
const apiListRouter = require('./routes/api-lists');
const apiTaskRouter = require('./routes/api-tasks');
const apiTaskTypeRouter = require('./routes/api-task-types');
const apiTagsRouter = require('./routes/api-tags');
const apiTagJoinsRouter = require('./routes/api-tag-joins');

const { sessionSecret } = require('./config');
const { restoreUser } = require('./auth');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser(sessionSecret));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    name: 'whats-next.sid',
    secret: sessionSecret,
    store,
    saveUninitialized: false,
    resave: false,
}));
  // create Session table if it doesn't already exist
store.sync();

app.use(restoreUser);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/favicon.ico', express.static('images/favicon.ico'));
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/account', accountRouter);
app.use('/demo', demoRouter);
app.use('/logout', logoutRouter);
app.use('/api/lists', apiListRouter);
app.use('/api/tasks', apiTaskRouter);
app.use('/api/task-types', apiTaskTypeRouter);
app.use('/api/tags', apiTagsRouter);
app.use('/api/tag-joins', apiTagJoinsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
