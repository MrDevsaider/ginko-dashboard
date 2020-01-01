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
app.set("views", path.join(__dirname, "rutas"));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

let scopes = ["indetify", "email", "guilds", "guilds.join"];

passport.use(
  new Strategy(
    {
      clientID: config.tokens.id,
      clientSecret: config.tokens.app,
      callbackURL: "https://localhost:300/login/callback",
      scope: scopes
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
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

app.get("/", (req, res) => {
  res.render("paginas/indice", {
    monmon: "Esto es una prueba"
  });
});

app.get(
  "/login",
  passport.authenticate("discord", { scope: scopes }),
  (req, res) => {}
);

app.get(
  "/login/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/perfil");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//

app.get("/perfil", checkAuth, (req, res) => {
  console.log(req.user);
  res.render("paginas/perfil", {
    userData: req.user
  });
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated) return next();
  res.redirect("/");
}

app.listen(3000, err => {
  if (err) return console.error(err);
  console.log("Escuchando en 3000");
});
