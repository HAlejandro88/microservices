'use strict'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'test',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  creatAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  { id: 2, uuid: 'yyy-yyy-yyx', name: 'fixture2', ...agent },
  { id: 3, uuid: 'yyy-yyy-yyx', name: 'fixture3', username: 'testing', ...agent },
  { id: 4, uuid: 'www-www-ww', name: 'fixture5', connected: false, ...agent }
]

const extend = (obj, values) => {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  name: agents.filter(a => a.username === 'test'),
  byUuid: id => agents.filter(a => a.uuid === id).shift(),
  findById: id => agents.filter(a => a.id === id).shift()
}
