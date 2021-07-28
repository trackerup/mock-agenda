export default value => {
  if (!value) return ''
  try {
    let jsonTime = JSON.parse(value)
    return (jsonTime.hora < 10 ? '0' : '') + jsonTime.hora + ':' + (jsonTime.minuto < 10 ? '0' : '') + jsonTime.minuto
  } catch (error) {
    return value
  }
}
