/** URLs of shield.io used ot serve badge images. */
const SHIELDS_URL = 'https://img.shields.io/badge'

function sendRedirect(res, baton) {
  const { label, prettySize, color, extension } = baton
  const pathname = encodeURI(`/${label}-${prettySize}-${color}.${extension}`)

  let badgeUrl = `${SHIELDS_URL}${pathname}`

  if (baton.style) badgeUrl += `?style=${baton.style}`

  res.writeHead(303, {
    'location': badgeUrl,
    // align on github raw cdn which caches content for 5 minutes
    'cache-control': 'max-age=300',
    // set expires to avoid github caching
    //   https://github.com/github/markup/issues/224#issuecomment-48532178
    'expires': new Date(Date.now() + 300 * 1000).toUTCString()
  })
  res.end()
}

function sendJSON(res, baton) {
  res.writeHead(200, {
    'content-type': 'application/json'
  })
  res.end(JSON.stringify({
    prettySize: baton.prettySize,
    originalSize: baton.originalSize,
    size: baton.size,
    color: baton.color
  }))
}

/**
 * Send the response.
 * For image formats it redirects to shields.io to serve the badge image.
 *
 * @param {ServerResponse} res
 * @param {object} baton
 */
function send(res, baton) {
  if (baton.err) {
    baton.prettySize = baton.err.message.toLowerCase()
    baton.color = 'lightgrey'
  }

  if ('json' === baton.extension) {
    sendJSON(res, baton)
  }
  else {
    sendRedirect(res, baton)
  }
}

module.exports = send
