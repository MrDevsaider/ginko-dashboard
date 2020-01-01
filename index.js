const app = require("express")(),
  session = require("express-session"),
  passport = require("passport"),
  { Strategy } = require("passport-discord"),
  path = require("path"),
  config = require("./main-config.js"),
  { Client } = require("discord.js"),
  client = new Client();

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");
app.set("rutas", path.join(__dirname, "rutas"));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserealizeUser(function(obj, done) {
  done(null, obj);
});

let scopes = ["indetify", "email", "guilds", "guilds.join"];

passport.use(
  new Strategy(
    {
      clientID: config.tokens.id,
      clientSecret: config.tokens.app,
      callbackURL: "usa config poki",
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
    secret: "moneshermosa",
    resave: false,
    saveUninitialize: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res) {
  res.render("paginas/index", {
    monmon: "Esto es una prueba"
  });
});

app.get("/login", passport.authenticate("discord", { scope: scopes }), function(
  req,
  res
) {});

app.get(
  "/login/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/perfil");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//

app.get("perfil", checkAuth, function(re))

function checkAuth(req, res, next){
  if(req.isAuthenticated) return next();
  res.redirect("/");
}