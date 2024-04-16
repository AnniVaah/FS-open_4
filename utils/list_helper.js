const _ = require('lodash')

/* const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
] */

const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((subtotal, blog) => subtotal+blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (JSON.stringify(blogs)===JSON.stringify([])) return null
  else{
    return blogs.reduce((mostLikes, blog) => {
      if (blog.likes>mostLikes.likes) { return blog }
      else { return mostLikes }
    })
  }
}

const mostBlogs = (blogs) => {
  if (JSON.stringify(blogs)===JSON.stringify([])) return null
  else {
    const authors = _.groupBy(blogs, 'author')
    const blogsPerAuthor=_.map(authors, (blogs, author) => ({ author, blogs: blogs.length }))
    const mostBlogs = _.maxBy(blogsPerAuthor, 'blogs')
    return mostBlogs
  }
}


const mostLikes = (blogs) => {
  if (JSON.stringify(blogs)===JSON.stringify([])) return null
  else {
    const authors = _.groupBy(blogs, 'author')
    //console.log('authors',authors)
    const likesPerAuthor = _.map(authors, (blogs, author) => {
      const likesOfThisAuthor = blogs.reduce((subTotal, blog) => subTotal + blog.likes, 0)
      //console.log('likes of this: ',likesOfThisAuthor)
      return { author, likes: likesOfThisAuthor }
    })
    //console.log('likes per author',likesPerAuthor)
    const mostLikes = _.maxBy(likesPerAuthor, 'likes')
    //console.log('mostLikes',mostLikes)
    return mostLikes
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }