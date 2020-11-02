module.exports = (extractOptions = {}) => {
  if (extractOptions.implementation) {
    return extractOptions.implementation
  }
  if (extractOptions.dartSass) {
    return require("sass")
  }
  return require("node-sass")
}
