const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
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
  test('fails if there is no token', async () => {
    const unauthorizedBlog = {
      title: 'Unauthorized Blog',
      author: 'Mää',
      url: 'https://reactpatterns.com/mää9',
      likes: 1
    }
    await api
      .post('/api/blogs')
      .send(unauthorizedBlog)
      .set('Authorization', 'Bearer')
      .expect(401)
  })
  describe('when authorized', async () => {
    await User.deleteMany({})
    const newUser = {
      username: 'MinniH',
      name: 'Minni Hiiri',
      password: '12345'
    }
    await api
      .post('/api/users')
      .send(newUser)
    const user = {
      username: 'MinniH',
      password: '12345'
    }
    const userLoggedIn = await api
      .post('/api/login')
      .send(user)
    const token = userLoggedIn.body.token

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
        .set('Authorization', 'Bearer '+token)
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
        .set('Authorization', 'Bearer '+token)
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
        .set('Authorization', 'Bearer '+token)
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
        .set('Authorization', 'Bearer '+token)
        .expect(400)
    })
    test('[deleting] succeeds with a valid id', async () => {
      const blogToBeDeleted = {
        title: 'BlogToBeDeleted',
        author: 'Mää',
        url: 'https://reactpatterns.com/mää6',
        likes: 1
      }
      const response = await api
        .post('/api/blogs')
        .send(blogToBeDeleted)
        .set('Authorization', 'Bearer '+token)
      await api
        .delete('/api/blogs/'+response.body.id)
        .set('Authorization', 'Bearer '+token)
        .expect(204)
    })
  })

})
//TÄMÄ KESKEN:
describe('deleting a specific blog', () => {
})

after(async () => {
  await mongoose.connection.close()
})