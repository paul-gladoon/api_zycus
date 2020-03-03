import fetch from 'node-fetch'
import * as url from 'url'

async function nodeFetchy(method: string, host: string, endpoint: string = '', opts: object = {}) {
  const requestUrl = url.resolve(host, endpoint)
  const requestResult = await fetch(requestUrl, {method, ...opts})

  return {status: requestResult.status, body: await requestResult.json()}
}

export function fetchy(host) {
  return {
    get: nodeFetchy.bind(global, 'GET', host),
    post: nodeFetchy.bind(global, 'POST', host)
  }
}
