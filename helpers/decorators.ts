import * as argsParser from 'minimist'

declare const allure: any
declare const __globalLogger: any

const ENV_ARGS = argsParser(process.argv.slice(2))
const step = ENV_ARGS.l ? stepStub : stepAllure

function stepStub(smg, lowPriority = false) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function(...args) {
      const assertObject = (argAssert) => argAssert !== null && typeof argAssert === 'object'
      const itemContains = (paramToAssert) => {
        if (!assertObject(paramToAssert)) {return false}
        return Object.keys(paramToAssert).some((key) => {
          if (assertObject(paramToAssert[key])) {
            return itemContains(paramToAssert[key])
          }
        })
      }
      const argsWithoutElements = args.filter((el) => !itemContains(el))

      __globalLogger.error('_________________ method name: ', method.name)
      __globalLogger.error('_________________ method args: ', JSON.stringify(argsWithoutElements))
      __globalLogger.error('\n')
      __globalLogger.error('\n')

      try {
        return method.apply(this, args)
      } catch (error) {
        __globalLogger.error('_________________ method error: ', error.toString())
        throw error
      }
    }
    return descriptor
  }
}

function stepAllure(msg: string, lowPriority = false) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const reporter = allure._allure
    descriptor.value = async function(...args) {
      const originalArgs = args

      allure.addEnvironment('Automation environment', process.env.API_RUN_ENV)
      allure.addEnvironment('Automation suit', process.env.RUN_SUITS)
      allure.addEnvironment('Build number', process.env.BUILD_NUMBER)

      let result
      const objectArgs = args.filter((arg) => typeof arg === 'object')
      const notObjects = args.filter((arg) => typeof arg !== 'object')

      const params = notObjects.map((arg) => {
        if (arg != null) {
          return JSON.stringify(originalArgs)
        }
      }).join()
      const stepName = params.length ? `${msg}(${params})` : msg
      reporter.startStep(stepName, Date.now())
      objectArgs.forEach((arg, index) => {
        const assertObject = (argAssert) => argAssert !== null && typeof argAssert === 'object'
        const itemContains = (paramToAssert) => {
          if (!assertObject(paramToAssert)) {return false}
          return Object.keys(paramToAssert).some((key) => {
            if (assertObject(paramToAssert[key])) {
              return itemContains(paramToAssert[key])
            }
          })
        }

        if (assertObject(arg) && !itemContains(arg)) {
          const param = JSON.stringify(arg, null, '\t')
          allure.createAttachment(`arg${index}`, param, 'application/json')
        }
      })
      try {
        result = await method.apply(this, originalArgs)
        /* tslint:disable:no-unused-expression */
        reporter.endStep('passed', Date.now())
        return result
      } catch (e) {
        /* tslint:disable:no-unused-expression */
        allure.createAttachment('ERROR', e.toString(), 'text/plain')
        if (e.toString().includes('AssertionError')) {
          reporter.endStep('failed', Date.now())
        } else {
          reporter.endStep('broken', Date.now())
        }
        throw e
      }
    }
    return descriptor
  }
}

const attachDataToReport = ENV_ARGS.l ? attachDataToReportStub : attachDataToReportAllure

function attachDataToReportStub(title, params, screen = false) {
  return title + params
}

async function attachDataToReportAllure(title, params, screen = false) {

  const reporter = allure._allure
  const paramsWithoutElement = params
  reporter.startStep(title, Date.now())
  try {
    typeof params === 'object'
      ? allure.createAttachment(`${title}`, JSON.stringify(paramsWithoutElement, null, '\t'), 'application/json')
      : allure.createAttachment(`${title}`, params, 'text/plain')
    reporter.endStep('passed', Date.now())
  } catch (error) {
    reporter.endStep('broken', Date.now())
  }
}

const reportStep = ENV_ARGS.l ? reportStepStub : reportStepAllure

async function reportStepStub(title, fn) {
  await fn()
}
async function reportStepAllure(title, fn) {
  const reporter = allure._allure
  try {
    reporter.startStep(title, Date.now())
    await fn()
    reporter.endStep('passed', Date.now())
  } catch (e) {
    console.log('ASSERTION ERROR')
    reporter.endStep('failed', Date.now())
    throw e
  }
}

export {reportStep, step, attachDataToReport}
