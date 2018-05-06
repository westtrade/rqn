require('ts-node').register({
	/* options */
})

import * as fs from 'fs'
import Injector from './src/Injector'

export default function rqn(inputPath: string[], config = {}) {
	config = config || {}
	const pathList = (Array.isArray(inputPath) && inputPath.slice(0)) || [
		inputPath,
	]

	const injector = new Injector(inputPath, config)
	return injector.run.bind(injector)
}
