const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  const authorization = req.session.authorization;
  console.log("🚀 ~ auth ~ authorization:", authorization);

  if (!authorization || !authorization.accessToken) {
    return res.status(403).json({ message: "User not logged in" });
  }
  try {
    const decoded = jwt.verify(authorization.accessToken, "access");
    if (!decoded.username) {
      return res.status(403).json({ message: "User not logged in" });
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

const PORT = 5002;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
