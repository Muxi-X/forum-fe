const Request = (url, options = {}) => {
  url = `/api/v1${url}`
  const isFile = options.body instanceof FormData
  options.headers = isFile
      ? {}
      : {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
  options.headers.Authorization = localStorage.getItem('token')

  if (options.body) {
      options.body = isFile ? options.body : JSON.stringify(options.body)
  }
  return fetch(url, options).then(function (res) {
      return res.json()
  })
}

export default Request
