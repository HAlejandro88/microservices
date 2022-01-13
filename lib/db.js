'use strict'

const Sequelize = require('sequelize')

// Ocuparemos el patron singleton
let sequelize = null

const setUpDatabase = (config) => {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }

  return sequelize
}

module.exports = setUpDatabase
