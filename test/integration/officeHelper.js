const app = require('../../appManager');
const request = require('supertest');

module.exports = (db, config) => {

    const server = app(db, config);
    const testInstance = request(server);

    return {
        getOffices: (options) => 
            testInstance
                .get(`/api/office${options ? `?${options}` : ''}`)
                .expect(200)
                .then((res) => res.body)
        ,
        getOffice: (id) =>
            testInstance
                .get(`/api/office/${id}`)
                .expect(200)
                .then((res) => res.body)
        ,
        createOffice: (office) =>
            testInstance
                .post('/api/office/create')
                .send(office)
                .expect(200)
                .then((res) => res.body)
        ,
        updateOffice: (id, office) =>
            testInstance
                .post(`/api/office/update/${id}`)
                .send(office)
                .expect(200)
                .then((res) => res.body)
        ,
        deleteOffice: (id) =>
            testInstance
                .post(`/api/office/delete/${id}`)
                .expect(200)
                .then((res) => res.body)
        // ,
        // readAgents: (officeId) =>
        //     testInstance
        //         .post(`/api/office/agents`)
        //         .send(officeId)
        //         .expect(200)
        //         .then((res) => res.body)
    }
};
