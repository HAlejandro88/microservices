'use strict'

const db = require('../index');

const run = async () => {
   const config = {
     database: process.env.DB_NAME || 'multiverse',
     username: process.env.DB_USER || 'postgres',
     password: process.env.DB_PASS || 'postgres',
     host: process.env.DB_HOST || 'localhost',
     dialect: 'postgres'
   }

   const { Agent, Metric } = await db(config).catch(handleFatalError)

  const agent = await Agent.createOrUpdate({
    uuid: 'yyy',
    name: 'test',
    username: 'test',
    hostName: 'test',
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  console.log(agent)
}

const handleFatalError = (error) => {
  console.error(error.message)
  console.error(error.stack)
  process.exit(1)
}

run()
