const CrudService = require('./crud');
const validator = require('../helpers/validator');

class AgentsService extends CrudService {

    constructor(repository, officesRepository, propertiesRepository, schema, errors) {
        super(repository, errors);

        this.officesRepository = officesRepository;
        this.propertiesRepository = propertiesRepository;
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

    async delete(id) {
        await this.propertiesRepository.update(
            {
                agentId: null,
            },
            {
                where: {
                    agentId: id,
                },
            }
        );
        return await super.delete(id);
    }

    async bindOffice(agentId, officeId) {
        const office = await this.officesRepository.findById(officeId);
        
        if (!office) {
            throw this.errors.notFound;
        }

        return await super.update(agentId, {officeId: officeId});
    }

    async unbindOffice(agentId) {
        return await super.update(agentId, {officeId: null});
    }

    async readProperties(agentId, options) {
        options = {
            limit: Number(options.limit) || this.defaults.readChunk.limit,
            offset: Number(options.offset) || this.defaults.readChunk.offset
        };
        
        const agent = await this.repository.findById(agentId);

        if (!agent) {
            throw this.errors.notFound;
        }
        
        let properties = await this.propertiesRepository.findAll({
            where: {
                agentId: agentId,
            },
            limit: options.limit,
            offset: options.offset,
            raw: true,
        });

        return properties;
    }

}

module.exports = AgentsService;