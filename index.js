const app = require("express")(),
  session = require("express-session"),
  passport = require("passport"),
  { Strategy } = require("passport-discord"),
  path = require("path"),
  config = require('./index')

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserealizeUser(function(obj, done) {
  done(null, obj);
});

let scopes = ["indetify", "email", "guilds", "guilds.join"];

passport.use(
  new Strategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:3000/",
    scope: scopes,
  }
              )
)

app.use("/", require("./rutas/index"));
