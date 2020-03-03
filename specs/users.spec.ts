import {Microservice} from '../microservice_objects'
import {expect} from 'chai'
import {reportStep} from '../helpers'

describe('Users', function() {
  const microservice = new Microservice()

  it('User successfully GET a single user information', async function() {
    const userName = 'PaulGladoon'
    const response = await microservice.usersController.getSingleUser(userName)
    const keys = ['login', 'id', 'node_id', 'avatar_url']

    await reportStep('Verify that to the correct request - comes 200 response status', async () => {
      expect(response.status).equal(200, `${JSON.stringify(response.body)}`)
    })

    await reportStep(`Verify that the response body has all keys: ${keys}`, async () => {
      expect(response.body).to.include.all.keys(keys)
    })
  })

  it('User successfully get list email addresses for a user', async function() {
    const response = await microservice.usersController.getUserEmails()
    const keys = ['email', 'primary', 'verified', 'visibility']

    await reportStep('Verify that to the correct request - comes 200 response status', async () => {
      expect(response.status).equal(200, `${JSON.stringify(response.body)}`)
    })

    await reportStep(`Verify that the response body has all keys: ${keys}`, async () => {
      for (const data of response.body) {
        expect(data).to.have.all.keys(keys)
      }
    })
  })

  it('User successfully add email address(es)', async function() {
    const body = {
      'emails': ['test1@test.com']
    }
    const response = await microservice.usersController.postUserEmails(body)

    await reportStep('Verify that to the correct request - comes 200 response status', async () => {
      expect(response.status).equal(201, `${JSON.stringify(response.body)}`)
    })

    const addedEmail = response.body.find((data) => data.email === body.emails[0])

    await reportStep(`Verify that the response body key has this email: ${body.emails}`, async () => {
      expect(addedEmail.email).equal(body.emails[0])
    })
  })
})