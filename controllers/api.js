const express = require('express');

module.exports = (
    propertiesService,
    agentsService,
    officesService,
    cacheService,
    config,
) => {
    const router = express.Router();

    const agentsController = require('./agentsConroller')(agentsService, cacheService);
    const officesController = require('./officesController')(officesService, cacheService);
    const propertiesController = require('./propertiesController')(propertiesService, cacheService);

    router.use('/agent', agentsController);
    router.use('/office', officesController);
    router.use('/property', propertiesController);

    return router;
};