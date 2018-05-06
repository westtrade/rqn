import rqn from '../'
import * as dotenv from 'dotenv'

dotenv.config()

const config = {
	components: {
		db: {
			connect: 'mongodb://172.21.0.2/test',
		},
	},

	root: __dirname,
}

const injector = rqn(
	['./components/common', './components/controllers', './components/models'],
	config,
)

export default injector
