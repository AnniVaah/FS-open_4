
//const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const Blog = require('./models/blog')

const mongoUrl = process.env.MONGODB_URI
//alkup: const mongoUrl = 'mongodb://localhost/bloglist'

mongoose.connect(mongoUrl)

app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = app