'use strict'

const debug = require('debug')('multiverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./index.js')

const prompt = inquirer.createPromptModule()

const setup = async () => {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'this will destroy your database, are youre sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happend')
  }

  // Configuracio de sequilize
  const config = {
    database: process.env.DB_NAME || 'multiverse',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: msg => debug(msg),
    setup: true
  }
  await db(config).catch(handleFatalError)
  console.log('Success!')
  process.exit(0)
}

const handleFatalError = (error) => {
  console.error(`${chalk.red('[Fatal error]')} ${error.message}`)
  console.error(error.stack)
  process.exit(1)
}

setup()
