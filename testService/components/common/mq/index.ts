import amqp from 'amqp'

export default () => {
	return amqp.createConnection({
		url: process.env.AMQP_DSN || '',
	})
}
