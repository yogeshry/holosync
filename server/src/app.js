const express = require('express');
const bodyParser = require('body-parser');
const deviceRoutes = require('./routes/device.routes');
const dataRoutes = require('./routes/data.routes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const app = express();

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/devices', deviceRoutes);
app.use('/data', dataRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
