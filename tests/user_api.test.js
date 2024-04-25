const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

describe('when adding a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })
  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'MinniHiiri',
      name: 'Minni Hiiri',
      password: '123qwerty'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length+1)
    const usernames = response.body.map(r => r.username)
    assert(usernames.includes(newUser.username))
  })
  test('username is required', async() => {
    const userWithoutUsername = {
      name: 'Hannu Hanhi',
      password: 'Tuurilla'
    }
    await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
  test('password is required', async() => {
    const userWithoutPassword = {
      username: 'HaHa',
      name: 'Hannu Hanhi'
    }
    await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
  test('username must be at least 3 characters long', async () => {
    const newUser = {
      username: 'MH',
      name: 'Minni Hiiri',
      password: '123qwerty'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
  test('password must be at least 3 characters long', async () => {
    const newUser = {
      username: 'MinniH',
      name: 'Minni Hiiri',
      password: '12'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
  test('username must be unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Nobody',
      password: '12345'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})