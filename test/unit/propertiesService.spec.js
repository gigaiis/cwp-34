const errors = require('../../helpers/errors');
const schemaProperty = require('../../schemas/properties');
const PropertyService = require('../../services/propertiesService');
const properties = require('../../data/properties.json');
const agents = require('../../data/agents.json');
const repositoryMock = require('../mocks/repository');

describe('services/propertiesService', () => {

	let agentsRepository;
	let repository;
	let instance;


	beforeEach(() => {
		repository = repositoryMock(properties);
		agentsRepository = repositoryMock(agents);

		instance = new PropertyService(repository, agentsRepository, schemaProperty, errors);
	});

	afterEach(() => {
		repository.mockClear();
		agentsRepository.mockClear();
	});

	describe('constructor', () => {
		it('success', async () => {
			expect(instance.repository).toEqual(repository);
			expect(instance.agentsRepository).toEqual(agentsRepository);
			expect(instance.schema).toEqual(schemaProperty);
			expect(instance.errors).toEqual(errors);
			expect(instance.defaults).toEqual({
				readChunk: {
					limit: 5,
					offset: 0,
					sortOrder: 'asc',
					sortField: 'id'
				}
			})
		});
	});

	describe('readChunk', () => {

		let options;

		beforeEach(() => {
			options = {
				limit: 10,
				offset: 5,
				sortField: 'title',
				sortOrder: 'DESC'
			};
		});

		it('should call db.findAll', async () => {
			instance.readChunk(options);

			expect(repository.findAll).toHaveBeenCalled();
			expect(repository.findAll.mock.calls[0][0]).toEqual({
				limit: 10,
				offset: 5,
				order: [['title', 'DESC']],
				raw: true
			});
		})

		it('should return a promise', async () => {
			const ret = instance.readChunk(options);

			expect(ret).toBeInstanceOf(Promise);
		})

		it('should return all data', async () => {
			const ret = await instance.readChunk();

			expect(ret).toEqual(properties);
		})

		it('should use default options', async () => {
			instance.readChunk();

			expect(repository.findAll).toHaveBeenCalled();
			expect(repository.findAll.mock.calls[0][0]).toEqual({
				limit: 5,
				offset: 0,
				order: [['id', 'ASC']],
				raw: true
			});
		})
	});

	describe('readById', () => {

		let id;

		beforeEach(() => {
			id = 1;
		});

		it('should throw error if id is NaN', async () => {
			id = 'qwe';

			try {
				await instance.readById(id);
			} catch (e) {
				expect(e).toEqual(errors.invalidId);
			}
		})

		it('should call db.findById', async () => {
			await instance.readById(id);

			expect(repository.findById).toHaveBeenCalled();
			expect(repository.findById.mock.calls[0][0]).toEqual(1);
			expect(repository.findById.mock.calls[0][1]).toEqual({ raw: true });
		})

		it('should parse id in string view', async () => {
			id = '1';

			await instance.readById(id);

			expect(repository.findById).toHaveBeenCalled();
			expect(repository.findById.mock.calls[0][0]).toEqual(1);
		})

		it('should throw error founded item is undefined', async () => {
			try {
				await instance.readById(id);
			} catch (e) {
				expect(repository.findById).toHaveBeenCalled();
				expect(e).toEqual(errors.notFound);
			}
		})

		it('should return a promise', async () => {
			const ret = instance.readById(id);

			expect(ret).toBeInstanceOf(Promise);
		});

		it('should return right item', async () => {
			const ret = await instance.readById(id);

			expect(ret).toEqual({
				agentId: 2,
				currency: 'BYN',
				heading: 'Research and Development',
				location: '94 La Follette Pass',
				price: 2832
			});
		});
	});

	describe('create', () => {

		let data;

		beforeEach(() => {
			data = {
				price: 666,
				currency: 'USD',
				heading: 'OZ',
				location: 'https://www.oz.by'
			}
		});

		it('should throw error if validation failed (currency is one of [BYN, USD, EUR])', async () => {
			data.currency = 'qwe';
			try {
				await instance.create(data);
			} catch (e) {
				expect(e).toBeTruthy();
				expect(e.message).toEqual('"currency" must be one of [BYN, USD, EUR]');
				expect(e.code).toEqual('validate_error');
				expect(e.status).toEqual(400);
				expect(repository.create).not.toHaveBeenCalled();
			}
		});

		it('should throw error if validation failed (price is negative)', async () => {
			data.price = -10;
			try {
				await instance.create(data);
			} catch (e) {
				expect(e).toBeTruthy();
				expect(e.message).toEqual('"price" must be a positive number');
				expect(e.code).toEqual('validate_error');
				expect(e.status).toEqual(400);
				expect(repository.create).not.toHaveBeenCalled();
			}
		});

		it('should return a promise', async () => {
			const ret = instance.create(data);

			expect(ret).toBeInstanceOf(Promise);
		});

		it('should return created item', async () => {
			let ret = await instance.create(data);

			expect(ret).toEqual(data);
		});

		it('should call db.create', async () => {
			await instance.create(data);

			expect(repository.create).toHaveBeenCalled();
			expect(repository.create.mock.calls[0][0]).toEqual(data);
		});

	});

	describe('update', () => {

		let data;

		beforeEach(() => {
			data = {
				id: 2,
				price: 666,
				currency: 'USD',
				heading: 'OZ',
				location: 'https://www.oz.by'
			}
		});

		it('should throw error if validation failed (currency one of [BYN, USD, EUR])', async () => {
			data.currency = 'qwe';
			try {
				await instance.update(data);
			} catch (e) {
				expect(e).toBeTruthy();
				expect(e.message).toEqual('"currency" must be one of [BYN, USD, EUR]');
				expect(e.code).toEqual('validate_error');
				expect(e.status).toEqual(400);
				expect(repository.create).not.toHaveBeenCalled();
			}
		});

		it('should throw error if validation failed (price is negative)', async () => {
			data.price = -10;
			try {
				await instance.update(data);
			} catch (e) {
				expect(e).toBeTruthy();
				expect(e.message).toEqual('"price" must be a positive number');
				expect(e.code).toEqual('validate_error');
				expect(e.status).toEqual(400);
				expect(repository.create).not.toHaveBeenCalled();
			}
		});

		it('should return promise', async () => {
			const ret = instance.update(data);

			expect(ret).toBeInstanceOf(Promise);
		});

		it('should return updated item', async () => {
			const ret = await instance.update(data);

			expect(ret).toEqual(data);
		});

		it('should call db.update and db.readById', async () => {
			await instance.update(data);

			expect(repository.update).toHaveBeenCalled();
			expect(repository.update.mock.calls[0][0]).toEqual(data);
			expect(repository.update.mock.calls[0][1]).toEqual({ where: { id: 2 }, limit: 1 });

			expect(repository.findById).toHaveBeenCalled();
			expect(repository.findById.mock.calls[0][0]).toEqual(2);
		});

	});

	describe('delete', () => {

		let id;

		beforeEach(() => {
			id = 2;
		});

		it('should call db.destroy', async () => {
			await instance.delete(id);

			expect(repository.destroy).toHaveBeenCalled();
			expect(repository.destroy.mock.calls[0][0]).toEqual({ where: { id: 2 } });
		})

		it('should return a number', async () => {
			const ret = await instance.delete(id);

			expect(typeof ret).toEqual("number");
		})

		it('should return a number of deleted items', async () => {
			const ret = await instance.delete(id);

			expect(ret).toBe(1);
		})

	});

	describe('bindAgent', () => {

		let propId;
		let agentId;

		beforeEach(() => {
			propId = 1;
			agentId = 1;
		});

		it('should call db.findById', async () => {
			await instance.bindAgent(propId, agentId);

			expect(agentsRepository.findById).toHaveBeenCalled();
			expect(agentsRepository.findById.mock.calls[0][0]).toEqual(1);
		})

		it('should throw error founded item is undefined', async () => {
			try {
				await instance.bindAgent(propId, agentId);
			} catch (e) {
				expect(agentsRepository.findById).toHaveBeenCalled();
				expect(e).toEqual(errors.notFound);
			}
		})

		it('should return promise', async () => {
			const ret = instance.bindAgent(propId, agentId);

			expect(ret).toBeInstanceOf(Promise);
		});

		it('should return updated item', async () => {
			const ret = await instance.bindAgent(propId, agentId);

			expect(ret).toEqual({ agentId: 1 });
		});

		it('should call db.update and db.readById', async () => {
			await instance.bindAgent(propId, agentId);

			expect(repository.update).toHaveBeenCalled();
			expect(repository.update.mock.calls[0][0]).toEqual({ agentId });
			expect(repository.update.mock.calls[0][1]).toEqual({ where: { id: propId }, limit: 1 });

			expect(repository.findById).toHaveBeenCalled();
			expect(repository.findById.mock.calls[0][0]).toEqual(1);
		});

	});

	describe('unbindAgent', () => {

		let propId;

		beforeEach(() => {
			propId = 1;
		});

		it('should call db.findById', async () => {
			await instance.unbindAgent(propId);

			expect(repository.update).toHaveBeenCalled();
			expect(repository.update.mock.calls[0][0]).toEqual({agentId: null});
			expect(repository.update.mock.calls[0][1]).toEqual({where: {id: propId}, limit: 1});
		})

		it('should return promise', async () => {
			const ret = instance.unbindAgent(propId);

			expect(ret).toBeInstanceOf(Promise);
		});

		it('should return updated item', async () => {
			propId = 0;
			const ret = await instance.unbindAgent(propId);

			expect(ret).toEqual({agentId: null});
		});

		it('should call db.update and db.readById', async () => {
			await instance.unbindAgent(propId);

			expect(repository.update).toHaveBeenCalled();
			expect(repository.update.mock.calls[0][0]).toEqual({agentId: null});
			expect(repository.update.mock.calls[0][1]).toEqual({where: {id: propId}, limit: 1});

			expect(repository.findById).toHaveBeenCalled();
			expect(repository.findById.mock.calls[0][0]).toEqual(1);
		});

	});
});
