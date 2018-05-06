import $ from './injector'

$(($app, $server, $io, $mq) => {
	// $app.get('/', async (req, res) => {
	// 	res.json(await $('HomeController'))
	// })
	//
	$app.get('/add', async (req, res) => {
		res.json(
			await $(async ($MessageModel: any) => {
				// const msg = $MessageModel({
				// 	text: 'Fluffy',
				// })
				//
				// return msg.save()
			}),
		)
	})

	$io.on('connect', socket => {
		console.log('Socket')
	})

	const PORT = process.env.HTTP_PORT || ''
	$server.listen(PORT, () => {
		console.log('listening on *:' + PORT)
	})
}).catch(e => console.log(e))
