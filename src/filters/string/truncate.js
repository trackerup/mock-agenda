export default (value, length) => {
  length = length || 15
  if (!value || typeof value != 'string') return ''
  if (value.length <= length) return value
  return value.substring(0, length) + '...'
}
