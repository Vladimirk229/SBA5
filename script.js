// Global state
let posts = []
let editingPostId = null

// DOM elements
const form = document.getElementById('post-form')
const titleInput = document.getElementById('title')
const contentInput = document.getElementById('content')
const titleError = document.getElementById('title-error')
const contentError = document.getElementById('content-error')
const postsContainer = document.getElementById('posts-container')
const submitButton = document.getElementById('submit-btn')

// Load from localStorage on page load
window.addEventListener('DOMContentLoaded', function () {
  const saved = localStorage.getItem('posts')
  if (saved) {
    posts = JSON.parse(saved)
    renderPosts()
  }
})

// Save posts to localStorage
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts))
}

// Render all posts
function renderPosts() {
  postsContainer.innerHTML = ''
  posts.forEach(post => {
    const postEl = document.createElement('div')
    postEl.className = 'post'
    postEl.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-content">${post.content}</div>
      <div class="post-buttons">
        <button data-id="${post.id}" class="edit-btn">Edit</button>
        <button data-id="${post.id}" class="delete-btn">Delete</button>
      </div>
    `
    postsContainer.appendChild(postEl)
  })
}

// Clear error messages
function clearErrors() {
  titleError.textContent = ''
  contentError.textContent = ''
}

// Form submit handler
form.addEventListener('submit', function (event) {
  event.preventDefault()
  clearErrors()

  const title = titleInput.value.trim()
  const content = contentInput.value.trim()

  if (title === '') {
    titleError.textContent = 'Title is required.'
  }
  if (content === '') {
    contentError.textContent = 'Content is required.'
  }
  if (title === '' || content === '') return

  if (editingPostId !== null) {
    const post = posts.find(p => p.id === editingPostId)
    if (post) {
      post.title = title
      post.content = content
    }
    editingPostId = null
    submitButton.textContent = 'Add Post'
  } else {
    const newPost = {
      id: Date.now(),
      title: title,
      content: content,
      timestamp: new Date().toISOString()
    }
    posts.push(newPost)
  }

  savePosts()
  renderPosts()
  form.reset()
})

// Edit / Delete handlers
postsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-btn')) {
    const id = Number(event.target.dataset.id)
    posts = posts.filter(p => p.id !== id)
    savePosts()
    renderPosts()
  } else if (event.target.classList.contains('edit-btn')) {
    const id = Number(event.target.dataset.id)
    const post = posts.find(p => p.id === id)
    if (post) {
      titleInput.value = post.title
      contentInput.value = post.content
      editingPostId = id
      submitButton.textContent = 'Update Post'
    }
  }
})
