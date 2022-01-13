'use strict'

const setUpDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const setupAgent = require('./lib/agent')
const defaults = require('defaults')

module.exports = async (config) => {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10, // maximo conectados
      min: 0, // minimos conecatados
      idle: 10000 // tiempo maximo de spera
    },
    query: {
      raw: true // info basica en json
    }
  })

  const sequelize = setUpDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel) // Una agente va tener muchas metricas
  MetricModel.belongsTo(AgentModel) // el modelo de metrica pertenece a un agente

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true }) // configira mi base datos y modelos el force es par adecir borra la base de datso y creala de nuevo
  }

  const Agent = setupAgent(AgentModel)
  const Metric = {}

  return { Agent, Metric }
}
