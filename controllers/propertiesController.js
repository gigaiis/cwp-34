const CrudController = require('./crud');

class PropertyController extends CrudController {
    constructor(propertiesService, cacheService) {
        super(propertiesService, cacheService);

        this.agentBind = this.agentBind.bind(this);
        this.agentUnbind = this.agentUnbind.bind(this);

        this.routes['/agentBind'] = [{method: 'post', cb: this.agentBind}];
        this.routes['/agentUnbind'] = [{method: 'post', cb: this.agentUnbind}];

        this.registerRoutes();
    }

    async agentBind(req, res) {
        await this.service.bindAgent(req.body.id, req.body.agentId);
        res.json({success: true});
    }

    async agentUnbind(req, res) {
        await this.service.unbindAgent(req.body.id);
        res.json({success: true});
    }
}

module.exports = (propertiesService, cacheService) => {
    const controller = new PropertyController(propertiesService, cacheService);
    return controller.router;
};