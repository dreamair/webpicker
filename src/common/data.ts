import { writable } from 'svelte/store'

export interface StringField {
	type: 'string'
	name: string
	value?: string
	source?: string
}

export interface TextField {
	type: 'text'
	name: string
	value?: string
	source?: string
}

export interface NumberField {
	type: 'number'
	name: string
	value?: number
	source?: string
}

export interface UrlField {
	type: 'url'
	name: string
	value?: string
	source?: string
}

export interface ImageField {
	type: 'image'
	name: string
	value?: string
	source?: string
	alt?: string
}

export type Field = StringField | TextField | NumberField |
	ImageField | UrlField

export function isStringField(field?: Field): field is StringField {
	return field?.type === 'string'
}

export function isTextField(field?: Field): field is TextField {
	return field?.type === 'text'
}

export function isUrlField(field?: Field): field is UrlField {
	return field?.type === 'url'
}

export function isImageField(field?: Field): field is ImageField {
	return field?.type === 'image'
}

export function stringField(name: string, value?: string) {
	return value ? { type: 'string', name, value } : undefined
}

export function textField(name: string, value?: string) {
	return value ? { type: 'text', name, value } : undefined
}

export function numberField(name: string, value?: string) {
	return value
		? { type: 'number', name, value: value ? parseInt(value) : undefined }
		: undefined
}

export function urlField(name: string, url?: string, baseUrl?: string) {
	return url
		? {
			type: 'url',
			name, value: baseUrl ? new URL(url, baseUrl).href : url,
			source: baseUrl,
		}
		: undefined
}

export function imageField(name: string, url?: string, baseUrl?: string) {
	return url
		? {
			type: 'image',
			name, value: baseUrl ? new URL(url, baseUrl).href : url,
			source: baseUrl,
		}
		: undefined
}

export const fieldLists = {
	default: [
		{ name: 'title', type: 'string' },
		{ name: 'description', type: 'text' },
		{ name: 'image', type: 'image' },
		{ name: 'url', type: 'url' },
	],
	product: [
		{ name: 'title', type: 'string' },
		{ name: 'description', type: 'text' },
		{ name: 'image', type: 'image' },
		{ name: 'price', type: 'number' },
		{ name: 'url', type: 'url' },
	],
} satisfies Record<string, Field[]>


export const data = writable<Field[]>(fieldLists.default)


export function getField(fields: Field[], name: string) {
	return fields.find(f => f.name === name)
}

export function updateField(fields: Field[], name: string, data: object) {
	const idx = fields.findIndex(f => f.name === name)
	if (idx === -1) return fields
	const newFields = [...fields]
	newFields[idx] = { ...newFields[idx], ...data }
	return newFields
}

export function updateFields(fields: Field[], newFields: Field[]) {
	const newFieldsMap = new Map(newFields.map(f => [f.name, f]))
	return fields.map(f => newFieldsMap.has(f.name)
		? { ...f, ...newFieldsMap.get(f.name) }
		: f) as Field[]
}

export function removeField(fields: Field[], name: string) {
	const idx = fields.findIndex(f => f.name === name)
	if (idx === -1) return fields
	const newFields = [...fields]
	newFields.splice(idx, 1)
	return newFields
}

export function exportJson(fields: Field[]) {
	const obj = fields.reduce((obj, field) => {
		if (!field.name) return obj
		if (field.value === undefined || field.value === null) return obj
		const val = { ...field } as Omit<Field, 'name'> & { name?: string }
		if (typeof field.value === 'string') {
			val.value = field.value.trim()
			if (val.value === '') return obj
		}
		if (val.source && val.value === val.source) delete val.source
		delete val.name
		return { ...obj, [field.name.trim()]: val }
	}, {} as Record<string, Omit<Field, 'name'>>)
	return JSON.stringify(obj, null, 2)
}

export function exportCsv(fields: Field[], inclHeaders = true) {
	fields = fields.map(f => ({ ...f, name: f.name.trim() })).filter(f => f.name)
	const values = fields
		.map(f => typeof f.value === 'string' ? f.value.trim() : f.value)
		.map(v => v && typeof v === 'string'
			? `"${v}"`
			: typeof v === 'number' ? `${v}` : '')
		.join(',')
	return inclHeaders
		? `${values}\n`
		: `${fields.map(field => field.name.trim()).join(',')}\n${values}\n`
}

export function exportMd(fields: Field[]) {
	return fields
		.map(f => {
			const name = f.name.trim()
			const value = f.value && typeof f.value === 'string'
				? f.value.trim()
				: f.value ?? ''
			return !name || !value ? '' : `### ${name}\n${value}\n`
		})
		.join('\n')
}

export type Command = {
	action: 'pick' | 'pick-screenshot' | 'pick-pageData'
	key?: string
}

export const activeCommand = writable<Command | null>(null)

export function toggleCommand(cmd: Command) {
	return (lastCmd: Command | null) =>
		lastCmd?.key === cmd.key && lastCmd?.action === cmd.action ? null : cmd
}


export interface Message {
	action: string
	payload: any
}


export interface Area {
	left: number
	top: number
	width: number
	height: number
}

export function scaleArea(area: Area, scale: number): Area {
	return {
		left: area.left * scale,
		top: area.top * scale,
		width: area.width * scale,
		height: area.height * scale,
	}
}
