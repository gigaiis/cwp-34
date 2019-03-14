const CrudService = require('./crud');
const validator = require('../helpers/validator');

class PropertiesService extends CrudService {

    constructor(repository, agentsRepository, schema, errors) {
        super(repository, errors);

        this.agentsRepository = agentsRepository;
        this.schema = schema;
    }

    async create(data) {
        let validCheck = validator(this.schema, data);
        if (!validCheck.isValid)
            throw this.errors.validError(validCheck.errors);

        return await super.create(data);
    }

    async update(data) {
        let validCheck = validator(this.schema, data);
        if (!validCheck.isValid)
            throw this.errors.validError(validCheck.errors);

        return await super.update(data.id, data);
    }

    async bindAgent(propertyId, agentId) {
        const agent = await this.agentsRepository.findById(agentId);
        
        if (!agent) {
            throw this.errors.notFound;
        }

        return await super.update(propertyId, {agentId: agentId});
    }

    async unbindAgent(propertyId) {
        return await super.update(propertyId, {agentId: null});
    }
}

module.exports = PropertiesService;