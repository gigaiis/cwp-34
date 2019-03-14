module.exports = (Sequelize, config) => {
    const options ={
        host : config.host,
        dialect : config.dialect,
        logging : false,
        define : {
            timestamps : true,
            paranoid : true,
            defaultScope : {
                where: {deletedAt : {$eq : null}}
            }
        }
    }

    const sequelize = new Sequelize(config.db, config.login, config.password, options);

    const Agents = require('../models/agents')(Sequelize, sequelize);
    const Offices = require('../models/offices')(Sequelize, sequelize);
    const Properties = require('../models/properties')(Sequelize, sequelize);

    Agents.hasMany(Properties, {foreignKey: 'agentId'});
    Properties.belongsTo(Agents, {constraints: false, foreignKey: 'agentId'});

    Offices.hasMany(Agents, {foreignKey: 'officeId'});
    Agents.belongsTo(Offices, {constraints: false, foreignKey: 'officeId'});

    return {
        agents : Agents,
        offices : Offices, 
        properties : Properties,

        sequelize,
        Sequelize
    }
}