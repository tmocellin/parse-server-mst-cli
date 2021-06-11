import { getImports, getMSTFields } from './schema'

import { GluegunStrings } from 'gluegun'
import { GluegunTemplateGenerateOptions } from 'gluegun/build/types/toolbox/template-types'
import { Schema } from '../types'

export async function generateModels(
  schemas: Schema[],
  generate: (options: GluegunTemplateGenerateOptions) => void,
  info: (msg: string) => void
): Promise<void> {
  schemas.forEach(async schema => {
    const fields = getMSTFields(schema.fields)
    const imports = getImports(fields)
    await generate({
      template: 'model.ts.ejs',
      target: `models/${schema.className}/${schema.className}.ts`,
      props: { name: schema.className, fields, imports },
    })
    info(`${schema.className} model generated !`)
  })
}

export async function generateStores(
  schemas: Schema[],
  generate: (options: GluegunTemplateGenerateOptions) => void,
  info: (msg: string) => void,
  strings: GluegunStrings
): Promise<void> {
  schemas.forEach(async schema => {
    await generate({
      template: 'store.ts.ejs',
      target: `models/${schema.className}Store/${schema.className}Store.ts`,
      props: {
        name: schema.className,
        camelCasedName: strings.camelCase(schema.className),
      },
    })
    info(`${schema.className}Store store generated !`)
  })
}