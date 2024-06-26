const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name:1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (request.user){
    const user = request.user
    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })
    const result = await newBlog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  } else {
    response.status(401).json({ error: 'token needed to add a blog' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)
  if (user && JSON.stringify(blogToDelete.user)===JSON.stringify(user._id)){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }else{
    response.status(401).json({ error: 'unauthorized to delete' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if(result){
    response.status(200).json(result)
  }else{
    response.status(404).end()
  }
})

module.exports = blogsRouter