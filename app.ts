import express from 'express'
import config from 'config'
import https from 'https'
import fs from 'fs'

import auth from './src/routes/auth.routes'
import user from './src/routes/user.routes'
import bets from './src/routes/bets.routes'
import path from 'path'

const mongoose = require('mongoose')

const app = express()

const httpsOptions = {
	key: fs.readFileSync('/etc/letsencrypt/live/lmru-returns.ru/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/lmru-returns.ru/fullchain.pem'),
}

const isProd = process.env.NODE_ENV === 'production'
app.use(express.json({ limit: '3mb' }))

app.use('/api/user', user)
app.use('/api/auth', auth)
app.use('/api/bets', bets)

if (isProd) {
	app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
	})
}

const PORT = config.get('port') || 5005

async function start() {
	try {
		await mongoose.connect(config.get('mongoURL'))

		if (isProd) {
			https.createServer(httpsOptions, app).listen(PORT, () => {
				console.log(`HTTPS server started on port ${PORT}...`)
			})
		} else {
			app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
		}
	} catch (e: any) {
		console.log('Server error: ', e.message)
		process.exit(1)
	}
}

start()
