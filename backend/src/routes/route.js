const auth = require('./auth');
const pets = require('./pets');
const appointments = require('./appointments');
const payments = require('./payments');
const notifications = require('./notifications');

function router(app) {
    const apiVersion = process.env.DEFAULT_VERSION || '/api/v1';
    app.use(`${apiVersion}/auth`, auth);
    app.use(`${apiVersion}/pets`, pets);
    app.use(`${apiVersion}/appointments`, appointments);
    app.use(`${apiVersion}/payments`, payments);
    app.use(`${apiVersion}/notifications`, notifications);
}

module.exports = router;