module.exports = (data) => {
	const internalData = data;
	const mock = {
		findAll: jest.fn((params) => Promise.resolve(internalData)),

		findById: jest.fn((id) => Promise.resolve(internalData[id])),

		create: jest.fn((item) => {
			internalData.push(item);
			return {
				get: () => Promise.resolve(item)
			}
		}),

		update: jest.fn((item, obj) => {
			internalData[+obj.where.id] = item;
			return Promise.resolve([1, [item]]);
		}),

		destroy: jest.fn((obj) => {
			delete internalData[obj.where.id];
			return Promise.resolve(1);
		})
	};

	mock.mockClear = () => {
		mock.findAll.mockClear();
		mock.findById.mockClear();
		mock.create.mockClear();
		mock.update.mockClear();
		mock.destroy.mockClear();
	};

	return mock;
};
