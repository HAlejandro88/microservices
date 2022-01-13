
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

let AgentStub = null

let db = null
let sandbox= null
// sandbox is specific environment for sinon to have to do one test when the finish the test the sandbox restart

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }
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
  let agent = await db.Agent.findById(1)
  t.deepEqual(agent, agentFixtures.findById(1), 'should be the same')
})
