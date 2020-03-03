import {AuthenticationController, UsersController} from './controllers'

const apiEnv = process.env.API_RUN_ENV

class Microservice {
  private host: string
  public authenticationController: AuthenticationController
  public usersController: UsersController

  constructor(host = apiEnv || 'https://api.github.com') {
    this.host = host
    this.authenticationController = new AuthenticationController(this.host)
    this.usersController = new UsersController(this.host)
  }
}

export {Microservice}