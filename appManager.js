const express = require('express');
//const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const errors = require('./helpers/errors');

const propertySchema = require('./schemas/properties');
const agentSchema = require('./schemas/agents');
const officeSchema = require('./schemas/offices');

const PropertyService = require('./services/propertiesService');
const AgentService = require('./services/agentsService');
const OfficeService = require('./services/officesService');
const LoggerService = require('./services/loggerService');
const CacheService = require('./services/cacheService');

module.exports = (db, config) => {
    const app = express();

    // Services
    const propertyService = new PropertyService(db.properties, db.agents, propertySchema, errors);
    const agentService = new AgentService(db.agents, db.offices, db.properties, agentSchema, errors);
    const officeService = new OfficeService(db.offices, db.agents, officeSchema, errors);
    const loggerService = new LoggerService();
    const cacheService = new CacheService();

    // Controllers
    const logger = require('./globalControllers/loggerController')(loggerService);
    const error = require('./globalControllers/error');
    const cache = require('./globalControllers/cacheController')(cacheService,loggerService);
    const apiController = require('./controllers/api')(
        propertyService,
        agentService,
        officeService,
        cacheService,
        config,
    );

    // Mounting
    app.use(express.static('public'));
    //app.use(cookieParser(config.cookie.key));
    app.use(bodyParser.json());

    app.use('/api', logger);
    app.use('/api', cache);
    app.use('/api', apiController);
    app.use('/api', error);

    return app;
};