
const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const agentFixtures =  require('./fixtures/agent')

const config = {
  logging: () => {}
}

let MetricStub = {
  belongsTo: sinon.spy(), // specific function for do mock
}

let single = Object.assign({}, agentFixtures.single)
let id = 1
let AgentStub = null
let db = null
let sandbox= null
// sandbox is specific environment for sinon to have to do one test when the finish the test the sandbox restart

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model findById stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.findById(id)))

  //const setupDatabase = require('../index') change require for proxyquire
  const setupDatabase = proxyquire('../index', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub,
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
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findById should be called on model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with argument 1')
  t.deepEqual(agent, agentFixtures.findById(id), 'should be the same')
})
