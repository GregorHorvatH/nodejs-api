require('./app/models');

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const { appPort, mongoUri, mongoOptions } = config.app;
const app = express();

config.express(app);
config.routes(app);

mongoose
  .connect(mongoUri, mongoOptions)
  .then(() =>
    app.listen(appPort, () => console.log(`Listening on port ${appPort}...`)),
  )
  .catch(console.error);
