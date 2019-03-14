const Sequelize = require('sequelize');
const config = require('./config.json');
const hostname = '127.0.0.1';
const port = 3000;

const db = require('./context')(Sequelize, config);
const server = require('./appManager')(db, config);
const tempDataToDb = require('./helpers/dataToDb');

(async function () {
    await db.sequelize.sync({force: true});
    await tempDataToDb(db);

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`)
    });
})();