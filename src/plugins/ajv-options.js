module.exports = {
  customOptions: {
    keywords: {
      minDate: {
        validate:  (_, data, parentData, path, params, key) => {
          return !_ || new Date(data) >= _
        }
      },
      maxDate: {
        validate:  (_, data, parentData, path, params, key) => {
          return !_ || new Date(data) <= _
        }
      }
    }
  }
}