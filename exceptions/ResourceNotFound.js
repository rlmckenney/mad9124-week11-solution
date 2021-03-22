class ResourceNotFoundException extends Error {
  constructor(...args) {
    super(...args) // calls the parent constructor function
    Error.captureStackTrace(this, ResourceNotFoundException)
    this.code = 404
    this.status = '404'
    this.title = 'Resource not found'
    this.description = this.message
  }
}

export default ResourceNotFoundException
