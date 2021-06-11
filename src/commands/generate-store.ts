import { GluegunToolbox, filesystem, strings } from 'gluegun'
import { generateModels, generateStores } from '../utils/store'

import { InitOptions } from '../types'
import { checkParams } from '../utils/options'
import { getSchemas } from '../utils/schema'

module.exports = {
  name: 'generate-store',
  alias: ['gs'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print,
      config,
      template: { generate },
    } = toolbox

    // Check parameters
    const options = (config ?? parameters.options) as InitOptions
    checkParams(options, print.error)

    filesystem.remove('./models')
    filesystem.copy('./src/defaultModels/common.ts', './models/common.ts', {
      overwrite: true,
    })

    try {
      const schemas = await getSchemas(options.parseServerUrl, options.parseAppId, options.parseMasterKey)
      await generateModels(schemas, generate, print.info)
      await generateStores(schemas, generate, print.info, strings)
    } catch (error) {
      print.error('Error : ')
      print.error(error)
      return
    }

    print.success(`Generated files at models`)
  },
}
