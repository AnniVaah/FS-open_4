const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are right amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have key "id"', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
  })

  describe('deleting a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const id = helper.initialBlogs[0]._id
      await api
        .delete('/api/blogs/'+id)
        .expect(204)
    })
  })

  describe('updating the "likes"', () => {
    test('succeeds with valid data', async () => {
      const blog = helper.initialBlogs[0]
      blog.likes += 1
      await api
        .put('/api/blogs/'+blog._id)
        .send(blog)
        .expect(200)
    })
    test('fails with statuscode 404 if the blog doesn\'t exist', async () => {
      const id = '66279e2875a7d650a95372b2'
      const blog = helper.initialBlogs[0]
      await api
        .put('/api/blogs/'+id)
        .send(blog)
        .expect(404)
    })
  })

})

describe('when adding a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Mää',
      url: 'https://reactpatterns.com/mää',
      likes: 1
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
    const authors = response.body.map(r => r.author)
    assert(authors.includes('Mää'))
  })

  test('if "likes" is undefined, it will be set to 0', async () => {
    const newBlog = {
      title: 'Nolikesblog',
      author: 'Mie',
      url: 'https://reactpatterns.com/mie'
    }
    const savedBlog= await api
      .post('/api/blogs')
      .send(newBlog)
    assert.strictEqual(savedBlog.body.likes,0)
  })

  test('title is required', async() => {
    const blogWithoutTitle ={
      author: 'Minää',
      url: 'https://reactpatterns.com/minää'
    }
    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)
  })

  test('url is required', async() => {
    const blogWithoutUrl ={
      title: 'Blog with no URL',
      author: 'Minää'
    }
    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)
  })

})

after(async () => {
  await mongoose.connection.close()
})