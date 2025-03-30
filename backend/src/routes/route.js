const auth = require('./auth');
const admin = require('./admin');
const staff = require('./staff');
const user = require('./user');
const vet = require('./vet')
function router(app) {
    const apiVersion = process.env.DEFAULT_VERSION || '/api/v1';
    app.use(`${apiVersion}/auth`, auth);
    app.use(`${apiVersion}/admin`, admin);
    app.use(`${apiVersion}/staff`, staff);
    app.use(`${apiVersion}/user`, user);
    app.use(`${apiVersion}/vet`, vet);
}

module.exports = router;
