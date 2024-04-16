const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((subtotal, blog) => subtotal+blog.likes, 0)

module.exports ={ dummy, totalLikes }