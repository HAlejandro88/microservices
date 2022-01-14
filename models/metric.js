'use strict'

const Sequelize = require('sequelize')
const setUpDatabase = require('../lib/db')

const setupMetricModel = (config) => {
  const sequelize = setUpDatabase(config)

  return sequelize.define('metric', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}

module.exports = setupMetricModel
