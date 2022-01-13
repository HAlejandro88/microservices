const Sequelize = require('sequelize')
const setUpDatabase = require('../lib/db')

const setupAgentModel = (config) => {
  const sequelize = setUpDatabase(config)

  return sequelize.define('agent', {
    uuid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hostName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    connected: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })
}

module.exports = setupAgentModel
