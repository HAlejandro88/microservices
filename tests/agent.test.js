
const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const agentFixtures = require('./fixtures/agent')

const config = {
  logging: () => {}
}

const MetricStub = {
  belongsTo: sinon.spy() // specific function for do mock
}

const single = Object.assign({}, agentFixtures.single)
const id = 1
let AgentStub = null
let db = null
const uuid = 'yyy-yyy-yyy'
let sandbox = null
// sandbox is specific environment for sinon to have to do one test when the finish the test the sandbox restart
const uuidArgs = {
  where: {
    uuid
  }
}

const usernameArgs = {
  where: { username: 'test', connected: true }
}

const connectedArgs = { where: { connected: true } }

const newAgent = {
  id: 1,
  uuid: 'zzz-zzz-zzz',
  name: 'testAgent',
  username: 'angetSpy',
  hostname: 'test',
  pid: 0,
  connected: false,
  creatAt: new Date(),
  updatedAt: new Date()
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }

  // MODEL findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  // Model findById stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.findById(id)))

  // Model update Stub
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  // Model create Stub
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON () { return newAgent }
  }))

  // Model findAll Stub
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixtures.all))
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(agentFixtures.connected))
  AgentStub.findAll.withArgs(usernameArgs).returns(Promise.resolve(agentFixtures.name))

  // const setupDatabase = require('../index') change require for proxyquire
  const setupDatabase = proxyquire('../index', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

/* test('make it pass', t => {
  t.pass();
}); */

test('Agent', (assert) => {
  assert.truthy(db.Agent, 'Agent service should exist')
})

test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the ArgentModle')
})

test.serial('Agent find By Id', async t => {
  const agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findById should be called on model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with argument 1')
  t.deepEqual(agent, agentFixtures.findById(id), 'should be the same')
})

test.serial('Agent createOrUpdate when exist user', async t => {
  const agent = await db.Agent.createOrUpdate(single)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.update.calledOnce, 'update should be called Once')
  t.deepEqual(agent, single, 'Agent should be the same')
})

test.serial('Agent findByUuid', async t => {
  const agent = await db.Agent.findByUuid(uuid)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with uuid args')
  t.deepEqual(agent, agentFixtures.byUuid(uuid), 'agent should be the same')
})

test.serial('Agent#findConnected', async t => {
  const agents = await db.Agent.findConnected()

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(connectedArgs), 'findAll should be called with connected args')

  t.is(agents.length, agentFixtures.connected.length, 'agents should be the same amount')
  t.deepEqual(agents, agentFixtures.connected, 'agents should be the same')
})

test.serial('Agent#findByUsername', async t => {
  const agents = await db.Agent.findByUsername('test')

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(usernameArgs), 'findAll should be called with username args')
  t.is(agents.length, agentFixtures.name.length, 'agents should be the same amount')
  t.deepEqual(agents, agentFixtures.name, 'agents should be the same')
})

test.serial('Agent#createOrUpdate - exists', async t => {
  const agent = await db.Agent.createOrUpdate(single)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with uuid args')
  t.true(AgentStub.update.called, 'agent.update called on model')
  t.true(AgentStub.update.calledOnce, 'agent.update should be called once')
  t.true(AgentStub.update.calledWith(single), 'agent.update should be called with specified args')

  t.deepEqual(agent, single, 'agent should be the same')
})

test.serial('Agent#createOrUpdate - new', async t => {
  const agent = await db.Agent.createOrUpdate(newAgent)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith({
    where: { uuid: newAgent.uuid }
  }), 'findOne should be called with uuid args')
  t.true(AgentStub.create.called, 'create should be called on model')
  t.true(AgentStub.create.calledOnce, 'create should be called once')
  t.true(AgentStub.create.calledWith(newAgent), 'create should be called with specified args')

  t.deepEqual(agent, newAgent, 'agent should be the same')
})
