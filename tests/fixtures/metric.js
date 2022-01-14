const agentFixture = require('./agent')


const metric = {
  id: 1,
  agentId: 1,
  type: '18%',
  createdAt: new Date(),
  agent: agentFixture.findById(1)
}


const metrics = [
  metric,
  { id:2, value: '25%', ...metric },
  { id:3, value: '30%', ...metric },
  { agentId: 2, type: 'Memory', value: '33%', agent: agentFixture.findById(2) },
]

const sortBy  = (property) => {
  return (a, b) => {
    let aProp = a[property]
    let bProp = b[property]

    if (aProp < bProp) {
      return -1
    } else if (aProp > bProp) {
      return 1
    } else {
      return 0
    }
  }
};

const findByAgentUuid = (uuid) => {
  return metrics.filter(m => m.agent ? m.agent.uuid === uuid : false).map(m => {
    const clone = Object.assign({},m)
    delete clone.agent
    return clone
  })
}

const findByTypeAgentUuid = (type, uuid) => {
  return metrics.filter(m => m.type === type && (m.agent ? m.agent.uuid === uuid : false)).map(m => {
    const clone = Object.assign({}, m)

    delete clone.agentId
    delete clone.agent

    return clone
  }).sort(sortBy('createdAt')).reverse()
}


module.exports = {
  all: metrics,
  findByTypeAgentUuid,
  findByAgentUuid
}
