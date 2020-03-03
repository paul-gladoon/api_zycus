import {fetchy, step} from '../../helpers'

class AuthenticationController {
  private host: string
  private headers: object
  private token: string

  constructor(host) {
    this.host = host
    this.token = process.env.API_TOKEN
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `token ${this.token}`
    }
  }

  @step('GET request to Authenticating with user token')
  public async getAuth(requestHeaders?: object) {
    return fetchy(this.host).get('/', {headers: requestHeaders || this.headers})
  }
}

export {AuthenticationController}