// implement your posts router here
const express = require('express');
const Post = require('./posts-model')

const router = express.Router()
router.use(express.json())

// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database                                                          |
// | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**                                                                               |
// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**                                                  |
// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id  

router.get('/', (req, res) => {
  Post.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      res.status(500).json({
        message: "error getting post",
        err: err.message
      })
    })
})

router.get('/:id', (req, res) => {
  const post = Post.findById(req.params.id)
    post
    .then(post => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "error getting post",
        err: err.message
      })
    })    
})

router.get('/:id/comments', (req, res) => {
  const post = Post.findById(req.params.id)
    post
    .then(async post => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        })
      } else {
        const comments = await Post.findPostComments(post.id)
        console.log(comments)
        res.status(200).json(comments)
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "error getting post",
        err: err.message
      })
    })    
})

router.post('/', (req, res) => {
  let newPost = req.body
  console.log(newPost)
  if (!newPost.title || !newPost.contents) {
  // if (!newPost) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    })
  }
  else {
    Post.insert(newPost)
    .then(post =>  {
      newPost.id = post.id
      res.status(201).json(newPost)
    })
    .catch(err => {
      res.status(500).json({
        message: "error creating user",
        err: err.message
      })
    })   
  }
})

router.use('*', (req, res) => {
  res.status(404).json({
    message: "Page not found"
  })
})

module.exports = router