import * as fs from 'fs'
import { resolve } from 'path'

const props = Symbol('private propetries')

const ARGS_MATCHER = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
const getArgs = src => {
	return src.match(ARGS_MATCHER)[1].split(', ')
}

const exists = path =>
	new Promise(resolve =>
		fs.stat(path, (err, result) => resolve(err ? false : path)),
	)

export default class Injector {
	constructor(modules: string[], config: any = {}) {
		this[props] = {
			resolvers: {
				config,
			},
			modules,
		}
	}

	get root() {
		return resolve(this[props].resolvers.config.root || '')
	}

	get pathList() {
		return this[props].modules.slice(0)
	}

	getModuleConfig(modName) {
		return this[props].resolvers.config.components[modName] || {}
	}

	async findModule(name: string) {
		// name = name.replace(/^\$/, '')
		const stats = this.pathList
			.reduce(
				(result: string[], path: string) =>
					result.concat([
						resolve(this.root, `${path}/${name}.ts`),
						resolve(this.root, `${path}/${name}/index.ts`),
					]),
				[],
			)
			.map(exists)

		const [modPath] = (await Promise.all(stats)).filter((_: string) => !!_)
		return modPath && resolve(this.root, modPath)
	}

	async resolveArg(arg: string, modName: string, overloads: any = {}) {
		const normalizedName = arg.replace(/^\$/, '')

		if (normalizedName in overloads) {
			const resolvedArg = overloads[normalizedName]
			return resolvedArg
		}

		if (normalizedName === 'moduleConfig') {
			const resolvedArg = this.getModuleConfig(modName)
			return resolvedArg
		}

		if (normalizedName in this[props].resolvers) {
			return this[props].resolvers[normalizedName]
		}

		const servicePath = await this.findModule(normalizedName)

		if (!servicePath) {
			return
		}

		const { default: mod } = await import(servicePath)

		if (typeof mod === 'function') {
			const resolvedArg = await this.runFunction(
				mod,
				normalizedName,
				overloads,
			)

			this[props].resolvers[normalizedName] = resolvedArg
			return resolvedArg
		}

		if (mod) {
			this[props].resolvers[modName] = mod
			return mod
		}
	}

	async runFunction(mod: any, modName: string, overloads: any = {}) {
		const args = getArgs(mod.toString())
		const resolvedArgs = []
		for (let arg of args) {
			// console.log(arg)
			// Todo prevent infinitee recursion
			resolvedArgs.push(await this.resolveArg(arg, modName, overloads))
		}

		return mod(...resolvedArgs)
	}

	async run(fn, overloads = {}) {
		fn = fn || ''

		if (typeof fn === 'string') {
			const mod = await this.resolveArg(fn, 'caller', overloads)
			return typeof mod === 'function'
				? this.runFunction(mod, 'caller', overloads)
				: mod
		}

		return this.runFunction(fn, 'caller', overloads)
	}

	async multipliy(services: any, overloads = {}) {
		const isArray = Array.isArray(services)
		const resolved = Object.entries(services).map(
			([key, fn]) => async () => {
				const mod = await this.run(fn, overloads)
				return [key, mod]
			},
		)

		const result = await Promise.all(resolved)
		return result.reduce((result, [key, mod]) => {
			isArray ? result.push(mod) : (result[key] = mod)

			return result
		}, isArray ? [] : {})
	}
}
