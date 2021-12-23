import eduRoom from './edu/room.js'
import eduProductDev from './edu/productDev.js'
import eduOrganize from './edu/organize.js'
import eduAuth from './edu/auth.js'
import eduPerson from './edu/person.js'
import jsit from './edu/edu-jsit/app.js'
import wiki from './ent/jd-xa/wiki.js'
const config = require('app/app.config.js')
const version = config.version,
  name = config.name

function copywriting () {
  const copywriting = {}
  if (version === 'edu') {
    Object.assign(copywriting, {
      auth: eduAuth,
      organize: eduOrganize,
      person: eduPerson,
      productDev: eduProductDev,
      room: eduRoom
    })
    if (name === 'edu-jsit') {
      Object.assign(copywriting, jsit)
    }
  } else if (version === 'ent') {
    if (name === 'jd-xa') {
      Object.assign(copywriting, wiki)
    }
  }
  return copywriting
}
export default copywriting()
