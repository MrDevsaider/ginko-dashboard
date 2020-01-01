/* Definimos las variables de express y passport */
require("dotenv").config();
var express = require("express"),
  path = require("path"),
  config = require("./main-config.js"),
  session = require("express-session"),
  passport = require("passport"),
  { Strategy } = require("passport-discord"),
  app = express();

// EJS
app.engine("ejs", require("ejs").__express);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "rutas"));

/* Control de sesiones */
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

/** Información del oAuth permitida por el usuario en la aplicación */
var scopes = [
  "identify",
  "email",
  "guilds",
  "guilds.join"
];

/** Lógica del callback, proporcionando la ID de la apliación y la ID secreta de autenticación */
passport.use(
  new Strategy(
    {
      clientID: config.tokens.id,
      clientSecret: config.tokens.app,
      callbackURL: config.tokens.url + "/callback",
      scope: scopes
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret: "satella",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", function(req, res) {
  let loginstatus = true;
  if (!req.isAuthenticated()) {
    loginstatus = false;
  }
  res.render("paginas/indice", {
    isLogged: {
      link: "/logout",
      message: "Logout",
      status: loginstatus
    }
  });
});
app.get("/login", passport.authenticate("discord", { scope: scopes }), function(
  req,
  res
) {});
app.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/perfil");
  } // auth success
);
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
app.get("/perfil", checkAuth, function(req, res) {
  //Manda los párametros al al q
  console.log(req.user);
  res.render("paginas/perfil", {
    userdata: req.user
  });
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

app.listen(5000, function(err) {
  if (err) return console.log(err);
  console.log("Escuchando en 5000");
});
