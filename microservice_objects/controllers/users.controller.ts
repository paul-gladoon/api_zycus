import {fetchy, step} from '../../helpers'

class UsersController {
  private host: string
  private headers: object
  private token: string
  private getSingleUserEndpoint: string
  private getUserEmailsEndpoint: string

  constructor(host) {
    this.host = host
    this.token = process.env.API_TOKEN
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `token ${this.token}`
    }
    this.getSingleUserEndpoint = '/users/'
    this.getUserEmailsEndpoint = '/user/emails'
  }

  @step('GET request to "Get a single user"')
  public async getSingleUser(userName: string, requestHeaders?: object) {
    return fetchy(this.host).get(this.getSingleUserEndpoint + userName, {headers: requestHeaders || this.headers})
  }

  @step('GET request to "/user/emails"')
  public async getUserEmails(requestHeaders?: object) {
    return fetchy(this.host).get(this.getUserEmailsEndpoint, {headers: requestHeaders || this.headers})
  }

  @step('POST request to "/user/emails"')
  public async postUserEmails(bodyRequest: object, requestHeaders?: object) {
    return fetchy(this.host).post(this.getUserEmailsEndpoint, {body: JSON.stringify(bodyRequest), headers: requestHeaders || this.headers})
  }
}

export {UsersController}