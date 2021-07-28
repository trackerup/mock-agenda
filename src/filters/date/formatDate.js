import moment from 'moment'
export default value => {
  if (!value) return ''
  let sValue = (value instanceof Date ? value.toISOString() : typeof value == 'object' ? value : String(value))
  return moment(sValue).format('DD/MM/YYYY')
}
