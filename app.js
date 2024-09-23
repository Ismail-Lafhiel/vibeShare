const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const syncDatabase = require("./scripts/sync");
const session = require("express-session");
const flash = require("connect-flash");
const { redirectIfAuthenticated } = require("./middlewares/authMiddleware");
const globalVarsMiddleware = require("./middlewares/globalVarsMiddleware");
require("dotenv").config();
const crypto = require('crypto');

const app = express();

// Middleware de session
const secretkey = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: secretkey, 
  resave: false,  
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(flash());

// Middleware body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurer les routes
const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const articleRoutes = require('./routes/articles');

app.use('/articles', articleRoutes);
app.use("/", indexRouter);
app.use("/register", registerRouter);

// Configuration du moteur de vue
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware pour les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  const isDev = app.get('env') === 'development';
  res.status(500).render('error', {
    message: 'Erreur interne du serveur' + res.Error,
    error: isDev ? err : {}
  });
});

app.get('/test-error', (req, res) => {
  throw new Error('Test d\'erreur');
});

// Use global variables middleware
app.use(globalVarsMiddleware);

// Sync database and start server
syncDatabase().then(() => {
  const indexRouter = require("./routes/index");
  const registerRouter = require("./routes/register");
  const loginRouter = require("./routes/login");
  const passwordRecoveryRouter = require("./routes/passwordRecovery");
  const passwordUpdateRouter = require("./routes/passwordUpdate");
  const logoutRouter = require("./routes/logout");
  const profileRouter = require("./routes/profile");
  app.use("/", indexRouter);
  app.use("/register", redirectIfAuthenticated, registerRouter);
  app.use("/login", redirectIfAuthenticated, loginRouter);
  app.use("/passwordRecovery", redirectIfAuthenticated, passwordRecoveryRouter);
  app.use("/update-password", passwordUpdateRouter);
  app.use("/logout", logoutRouter);
  app.use("/articles", articleRoutes);
  app.use("/profile", profileRouter);
  app.use((req, res) => {
    res.status(404).render("404", { title: "Page not found" });
  });
});

  // Démarrer le serveur après la synchronisation de la base de données
  const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('Error starting the server:', error);
}

