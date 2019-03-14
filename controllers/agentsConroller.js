const CrudController = require('./crud');

class AgentController extends CrudController {
    constructor(agentsService, cacheService) {
        super(agentsService, cacheService);

        this.officeBind = this.officeBind.bind(this);
        this.officeUnbind = this.officeUnbind.bind(this);
        this.readProperties = this.readProperties.bind(this);

        this.routes['/officeBind'] = [{method: 'post', cb: this.officeBind}];
        this.routes['/officeUnbind'] = [{method: 'post', cb: this.officeUnbind}];
        this.routes['/properties'] = [{method: 'post', cb: this.readProperties}];

        this.registerRoutes();
    }

    async officeBind(req, res) {
        await this.service.bindOffice(req.body.id, req.body.officeId);
        res.json({success: true});
    }

    async officeUnbind(req, res) {
        await this.service.unbindOffice(req.body.id);
        res.json({success: true});
    }

    async readProperties(req, res) {
        res.json(await this.service.readProperties(req.body.id, req.query));
    }
}

module.exports = (agentsService, cacheService) => {
    const controller = new AgentController(agentsService, cacheService);
    return controller.router;
};