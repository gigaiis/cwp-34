const repo = require('../mocks/repository');
const officeHelper = require('./officeHelper');
const officesData = require('../../data/offices.json');
const config = require('../../config.json');

describe('controllers/officesController', () => {

    let helper;
    let officesRepo;

    beforeEach(() => {
        officesRepo = repo(officesData);
        helper = officeHelper({ offices: officesRepo}, config);
    });

    it('get all', async () => {
        expect.assertions(1);

        const offices = await helper.getOffices();

        expect(offices).toEqual(JSON.parse(JSON.stringify(officesData)));
    });

    it('get once', async () => {
        expect.assertions(1);

        const offices = await helper.getOffices();
        let officeId = offices.findIndex((office) => office.title === 'Greenberg');

        const hero = await helper.getOffice(officeId);

        expect(hero).toEqual(offices[officeId]);
    });

    it('create office', async () => {
        expect.assertions(2);

        const data = {
            title: 'TUT.BY',
            website: 'https://www.tut.by',
            address: 'Minsk'
        };

        const office = await helper.createOffice(data);
        const offices = await helper.getOffices();

        expect(data).toMatchObject(office);
        expect(offices).toContainEqual(expect.objectContaining(office));
    });

    it('update office', async () => {
        expect.assertions(1)

        let offices = await helper.getOffices();

        const item = offices.find((office) => office.title === 'Just Bea');
        let officeId = offices.findIndex((office) => office.title === 'Just Bea');

        item.address = '7758 Mauris Rd.';

        await helper.updateOffice(officeId, item);
        offices = await helper.getOffices();

        expect(offices).toContainEqual(expect.objectContaining(item));
    });

    it('delete office', async () => {
        expect.assertions(1);

        let offices = await helper.getOffices();

        const item = offices.find((office) => office.title === 'Just Bea');
        let officeId = offices.findIndex((office) => office.title === 'Just Bea');

        await helper.deleteOffice(officeId);

        offices = await helper.getOffices();

        expect(offices).not.toContainEqual(expect.objectContaining(item));
    });

    // it('read agents', async () => {
    //     expect.assertions(1);

    //     const item = await helper.readAgents(3);

    //     const agents = JSON.parse(JSON.stringify(officesData))
    //     const agentId = agents.findIndex((agent) => agent.officeId === 3);
    //     const agent = agents[agentId - 1];

    //     expect(item).toEqual(agent);
    // });
});

