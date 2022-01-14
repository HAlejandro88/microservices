'use strict'

const setupAgent = (AgentModel) => {
  const findById = id => AgentModel.findById(id)

  const createOrUpdate = async agent => {
    const condition = { //  sequelize query
      where: {
        uuid: agent.uuid
      }
    }
    const exisingAgent = await AgentModel.findOne(condition)

    if (exisingAgent) {
      const update = await AgentModel.update(agent, condition)
      return update ? AgentModel.findOne(condition) : exisingAgent
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  const findByUuid = (uuid) => {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  const findAll = () => AgentModel.findAll()

  const findConnected = () => {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  const findByUsername = username => AgentModel.findAll({
    where: {
      username,
      connected: true
    }
  })

  return {
    findById,
    createOrUpdate,
    findByUuid,
    findAll,
    findConnected,
    findByUsername
  }
}

module.exports = setupAgent
