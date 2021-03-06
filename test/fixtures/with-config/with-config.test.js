import consola from 'consola'
import { buildFixture } from '../../utils/build'

beforeAll(() => {
  process.env.NUXT_ENV_FOO = 'manniL'
})

let customCompressionMiddlewareFunctionName
const hooks = [
  ['render:errorMiddleware', (app) => {
    customCompressionMiddlewareFunctionName = app.stack[0].handle.name
  }]
]

describe('with-config', () => {
  buildFixture('with-config', () => {
    expect(consola.warn).toHaveBeenCalledTimes(6)
    expect(consola.fatal).toHaveBeenCalledTimes(0)
    expect(consola.warn.mock.calls).toMatchObject([
      ['Unknown mode: unknown. Falling back to universal'],
      ['Invalid plugin mode (server/client/all): \'abc\'. Falling back to \'all\''],
      [{
        'additional': expect.stringContaining('plugins/test.json'),
        'message': 'Found 2 plugins that match the configuration, suggest to specify extension:'
      }],
      ['Please use `build.postcss` in your nuxt.config.js instead of an external config file. Support for such files will be removed in Nuxt 3 as they remove all defaults set by Nuxt and can cause severe problems with features like alias resolving inside your CSS.'],
      ['Using styleResources without the @nuxtjs/style-resources is not suggested and can lead to severe performance issues.', 'Please use https://github.com/nuxt-community/style-resources-module'],
      ['Notice: Please do not deploy bundles built with analyze mode, it\'s only for analyzing purpose.']
    ])
    expect(customCompressionMiddlewareFunctionName).toBe('damn')
  }, hooks)
})

afterAll(() => {
  delete process.env.NUXT_ENV_FOO
})
