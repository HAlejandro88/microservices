'use strict'

const Sequelize = require('sequelize')
const setUpDatabase = require('../lib/db')

const setupMetricModel = (config) => {
  const sequelize = setUpDatabase(config)

  return sequelize.define('agent', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}

module.exports = setupMetricModel
