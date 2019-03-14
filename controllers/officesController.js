const CrudController = require('./crud');

class OfficeController extends CrudController {
    constructor(agentsService, cacheService) {
        super(agentsService, cacheService);

        this.readAgents = this.readAgents.bind(this);

        this.routes['/agents'] = [{method: 'post', cb: this.readAgents}];

        this.registerRoutes();
    }

    async readAgents(req, res) {
        res.json(await this.service.readAgents(req.body.id, req.query));
    }
}

module.exports = (agentsService, cacheService) => {
    const controller = new OfficeController(agentsService, cacheService);
    return controller.router;
};