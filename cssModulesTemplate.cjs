module.exports = (dts) => {
  return dts.replace(/export let /g, 'export let $')
}
