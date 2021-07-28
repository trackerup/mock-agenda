export default value => {
  if (!value) return ''
  value = value.toString()
  return value.toLowerCase()
}
