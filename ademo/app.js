var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');
var officesRouter = require('./routes/offices');
var officesDwitRouter = require('./routes/offices_dwit');
var agentsRouter = require('./routes/agents');
var agentsDwitRouter = require('./routes/agents_dwit');
var approveagentsRouter = require('./routes/approveagents');
var sitesRouter = require('./routes/sites');
var statsRouter = require('./routes/stats');
var linksRouter = require('./routes/links');
var logsRouter = require('./routes/logs');
var profileRouter = require('./routes/profile');
var adminsRouter = require('./routes/admins');
var adminsDwitRouter = require('./routes/admins_dwit');
var settingsRouter = require('./routes/settings');
var logoutRouter = require('./routes/logout');
var loginRouter = require('./routes/login');
var captchaRouter = require('./routes/captcha');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', indexRouter); //in order to let nginx could reverse proxy it
app.use('/news', newsRouter);
app.use('/offices', officesRouter);
app.use('/offices_dwit', officesDwitRouter);
app.use('/agents', agentsRouter);
app.use('/agents_dwit', agentsDwitRouter);
app.use('/approveagents', approveagentsRouter);
app.use('/sites', sitesRouter);
app.use('/stats', statsRouter);
app.use('/links', linksRouter);
app.use('/logs', logsRouter);
app.use('/profile', profileRouter);
app.use('/admins', adminsRouter);
app.use('/admins_dwit', adminsDwitRouter);
app.use('/settings', settingsRouter);
app.use('/logout', logoutRouter);
app.use('/login', loginRouter);
app.use('/captcha', captchaRouter);

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
  res.render('error');
});

module.exports = app;
