export function htmlParse (tpl, params) {
  let _tpl = tpl
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      var reg = new RegExp(`{{${key}}}`, 'g')
      _tpl = _.replace(_tpl, reg, params[key])
    }
  }
  return _tpl
}
