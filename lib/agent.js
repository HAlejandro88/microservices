'use strict'

const setupAgent = (AgentModel) => {
  const findById = id => AgentModel.findById(id)

  return  {
    findById
  }
}

module.exports = setupAgent
