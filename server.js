const express = require('express');
const cors = require("cors");
const db = require("./app/models");
const app = express()
const routes = require('./app/routes/AuthRoutes');
const initial = require("./seed.js");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes)
// require('./app/routes/AuthRoutes')(app);
// require('./app/routes/user.routes')(app);

app.get('/api/auth/signin', function (req, res) {
  res.send('Hello World')
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

