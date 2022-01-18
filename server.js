const express = require('express');
const cors = require("cors");
const db = require("./app/models");
const app = express()
const initial = require("./seed.js");

db.sequelize.sync({ force: true }).then(() => {
  // console.log("Drop and re-sync db.");
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

require('./app/routes/AuthRoutes')(app);
require('./app/routes/InvoiceRoutes')(app);
require('./app/routes/ClientRoutes')(app);
require('./app/routes/CompanyRoutes')(app);

app.get('/', function (req, res) {
  res.send('Hello World')
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

