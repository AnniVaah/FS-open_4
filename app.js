//const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')

const mongoose = require('mongoose')
const Blog = require('./models/blog')

const mongoUrl = process.env.MONGODB_URI
//alkup: const mongoUrl = 'mongodb://localhost/bloglist'

mongoose.connect(mongoUrl)

app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app