const config = require('app/app.config.js')
/**
* Get the user IP throught the webkitRTCPeerConnection
* @param onNewIP {Function} listener function to expose the IP locally
* @return undefined
*/
export function getLocalIp (onNewIP) {
  // onNewIp - your listener function for new IPs
  // compatibility for firefox and chrome
  const myPeerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection
  // eslint-disable-next-line new-cap
  const pc = new myPeerConnection({ iceServers: [] }),
    noop = function () { },
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

  function iterateIP (ip) {
    if (!localIPs[ip]) onNewIP(ip)
    localIPs[ip] = true
  }

  // create a bogus data channel
  pc.createDataChannel('')

  // create offer and set local description
  pc.createOffer().then(function (sdp) {
    sdp.sdp.split('\n').forEach(function (line) {
      if (line.indexOf('candidate') < 0) return
      line.match(ipRegex).forEach(iterateIP)
    })
    pc.setLocalDescription(sdp, noop,
      noop)
  }).catch(function (reason) {
    // An error occurred, so handle the failure to connect
  })
  // listen for candidate  events
  pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate ||
      !ice.candidate.candidate.match(ipRegex)) return
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
  }
}

export function getPublicIp () {
  return returnCitySN['cip']
}

export function getCity () {
  return config.extranet ? returnCitySN['cname'] : ''
}

/**
 * @param {object} address 必须是个对象，可以是空对象，可以包含ip,city属性
 */
export function setAddress (address) {
  if (config.extranet) {
    // eslint-disable-next-line no-use-before-define
    address.ip = getPublicIp()
    // eslint-disable-next-line no-use-before-define
    address.city = getCity()
  } else {
    getLocalIp((ip) => {
      // eslint-disable-next-line no-use-before-define
      address.ip = ip
      // eslint-disable-next-line no-use-before-define
      address.city = ''
    })
  }
}
