const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '6634918c76108e0710c09570',
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '663472eea4be81e0a4d84386',
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '6634918c76108e0710c09570',
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '663472eea4be81e0a4d84386',
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '6634918c76108e0710c09570',
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '663472eea4be81e0a4d84386',
    __v: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url:'http://lol' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

const initialUsers = [
  {
    username: 'root',
    name: 'Pohjimmainen',
    password: 'Kissa123',
    blogs: []
  },
  {
    username: 'MikkiHiiri',
    name: 'Mikki Hiiri',
    password: 'SalasanA',
    blogs: []
  }
]

const initialUsers2 = [
  {
    '_id':{ '$oid':'6628f23e21d07d75b04a0bd2' },
    'username':'root',
    'name':'Ekakäyttäjä',
    'passwordHash':'$2b$10$H7vpWbjHOocF/Rcil9nSMuDoxVzUi0JmjOPxoPGwBcFdzE3IW.7OO',
    'blogs':[],
    '__v':{ '$numberInt':'0' }
  },
  {
    '_id':{ '$oid':'6629e6f7d69e35bbfd96b084' },
    'username':'aku',
    'passwordHash':'$2b$10$QNyga5ddZz.yIapttYGne.8j5HV9CN3Fk7gh4wwb72vSN77ePWusW',
    'blogs':[],
    '__v':{ '$numberInt':'0' }
  }
]

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, initialUsers
}