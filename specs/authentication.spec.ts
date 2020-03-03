import {Microservice} from '../microservice_objects'
import {expect} from 'chai'
import {reportStep} from '../helpers'

describe('Authentication', function() {
  const microservice = new Microservice()

  it('User successfully passes authentication', async function() {
    const response = await microservice.authenticationController.getAuth()

    await reportStep('Verify that to the correct request - comes 200 response status', async () => {
      expect(response.status).equal(200, `${JSON.stringify(response.body)}`)
    })
  })
})