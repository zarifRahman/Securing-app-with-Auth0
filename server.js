const express = require('express');
require("dotenv").config();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const checkScope = require("express-jwt-authz"); // Validate JWT scopes 

const app = express();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requestiong more than 5 per minute
    jwksUri: 'https://zarif.us.auth0.com/.well-known/jwks.json'
  }),
  /* Validate the audience and the Issuer*/
  audience: 'http://localhost:3001',
  issuer: 'https://zarif.us.auth0.com/',
  algorithms: ['RS256']
});

// get
app.get("/public", function (req, res) {
  res.json({
    message: "Hello from a public API!"
  });
});

app.get("/private", jwtCheck, function (req, res) {
  res.json({
    message: "Hello from a private API!"
  });
});
app.get("/course", jwtCheck, checkScope(["read:courses"]), function (req, res) {
  res.json({
    courses: [
      { id: 1, title: "Building Apps with React and Redux" },
      { id: 2, title: "Creating Reusable React Components" }
    ]
  });
});

app.listen(3001);
/* configure express */
console.log("API server listening on " + process.env.REACT_APP_API_URL);