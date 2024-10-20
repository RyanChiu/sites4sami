var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');
var uploadRouter = require('./routes/upload_nov');
var officesRouter = require('./routes/offices');
var officesDwitRouter = require('./routes/offices_dwit');
var agentsRouter = require('./routes/agents');
var agentsDwitRouter = require('./routes/agents_dwit');
var agsnovRouter = require('./routes/ags_nov'); // ags means agents, nov means with no view
var approveagentsRouter = require('./routes/approveagents');
var sitesRouter = require('./routes/sites');
var sitesDwitRouter = require('./routes/sites_dwit');
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
var tracksDwitCBRoute = require('./routes/tracks_dwit_cb');
var nav2Route = require('./routes/nav2');

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
app.use('/upload_nov', uploadRouter);
app.use('/offices', officesRouter);
app.use('/offices_dwit', officesDwitRouter);
app.use('/agents', agentsRouter);
app.use('/agents_dwit', agentsDwitRouter);
app.use('/ags_nov', agsnovRouter);
app.use('/approveagents', approveagentsRouter);
app.use('/sites', sitesRouter);
app.use('/sites_dwit', sitesDwitRouter);
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
app.use('/cbs_tracks', tracksDwitCBRoute);
app.use('/nav2', nav2Route);

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
  // res.render('error');
  res.redirect('home?tips=Something went wrong.....');
});

module.exports = app;
