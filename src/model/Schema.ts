import type { FieldType } from './Field.js'

export type SchemaField = { name: string; type: FieldType }

export type Schema = SchemaField[]

export type Schemas = Record<string, Schema>

export const defaultSchemas = {
  default: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'image', type: 'image' },
    { name: 'url', type: 'url' },
  ],
  'all types': [
    { name: 'string', type: 'string' },
    { name: 'text', type: 'text' },
    { name: 'image', type: 'image' },
    { name: 'url', type: 'url' },
    { name: 'number', type: 'number' },
  ],
  product: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'image', type: 'image' },
    { name: 'price', type: 'number' },
    { name: 'url', type: 'url' },
  ],
} satisfies Schemas

export const newSchemaKey = '--new--'

export function equalSchema(a: Schema, b: Schema) {
  if (!a || !b) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const fa = a[i]
    const fb = b[i]
    if (fa.name !== fb.name || fa.type !== fb.type) return false
  }
  return true
}

export function addSchemaField(schemas: Schemas,
  key: string, field: SchemaField) {
  schemas = { ...schemas }
  schemas[key] = [...schemas[key], field]
  return schemas
}

export function moveSchemaField(schemas: Schemas,
  key: string, fieldName: string, relativeIdx: number) {
  if (relativeIdx === 0) return schemas
  const schema = schemas[key]
  if (!schema) return schemas
  const idx = schema.findIndex(({ name }) => name === fieldName)
  if (idx === -1) return schemas
  const toIdx = idx + relativeIdx
  const toIdxAdjusted = toIdx < 0
    ? toIdx + schema.length
    : toIdx >= schema.length
      ? toIdx - schema.length
      : toIdx
  const newSchema = [...schema]
  const field = newSchema.splice(idx, 1)[0]
  newSchema.splice(toIdxAdjusted, 0, field)
  schemas = { ...schemas }
  schemas[key] = newSchema
  return schemas
}

export function removeSchemaField(schemas: Schemas,
  key: string, fieldName: string) {
  const schema = schemas[key]
  if (!schema) return schemas
  const idx = schema.findIndex(({ name }) => name === fieldName)
  if (idx === -1) return schemas
  const newSchema = [...schema]
  newSchema.splice(idx, 1)
  schemas = { ...schemas }
  schemas[key] = newSchema
  return schemas
}

export function updateSchemaField(schemas: Schemas, key: string,
  fieldName: string, data: Partial<SchemaField>) {
  const schema = schemas[key]
  const idx = schema.findIndex(({ name }) => name === fieldName)
  if (idx === -1) return schemas
  const field = schema[idx]
  if ((!data.name || field.name === data.name)
    && (!data.type || field.type === data.type)) return schemas
  const newSchema = [...schema]
  newSchema[idx] = { ...field, ...data }
  return { ...schemas, [key]: newSchema }
}
