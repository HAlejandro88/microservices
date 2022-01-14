'use strict'

const setupMetric = (MetricModel, AgentModel) => {
  const create = async (uuid, metric) => {
    const agent = await AgentModel.findOne({
      where: { uuid }
    })

    if (agent) {
      Object.assign(metric, { agentId: agent.id })
      const result = await MetricModel.create(metric)
      return result.toJSON()
    }
  }

  const findByAgentUuid = async (uuid) => {
    return MetricModel.findAll({ // InnerJoin
      attributes: ['type'],
      group: ['type'],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    })
  }

  // busca por tipo de metrcia y id del agente

  const findByTypeAgentUuid = async (type, uuid) => {
    return MetricModel.findAll({
      attributes: ['id', 'type', 'value', 'createdAt'],
      where: {
        type
      },
      limit: 20, // linit de 20 registro
      order: [['createdAt', 'DESC']],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    })
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}

module.exports = setupMetric
