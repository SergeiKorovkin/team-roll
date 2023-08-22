import { Router } from 'express'
import auth from '../middleware/auth.middleware'
import Bet from '../models/Bet'
import User from '../models/User'

const { check } = require('express-validator')

const router = Router()

// получить историю ставок
router.get('/history', auth, async (req: any, res: any) => {
	try {
		const bets = await Bet.find()

		return res.status(200).json(bets.reverse())
	} catch (e) {
		console.log('e', e)
		res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
	}
})

// добавить новую ставку
router.post('/add', [auth, check('coins', 'Нет поля coins').exists()], async (req: any, res: any) => {
	try {
		const { coins, usersBet } = req.body
		const { name } = req.user

		if (coins <= 0 || usersBet.length === 0) return res.status(404).json({ message: 'Не надо так' })

		const users = await User.find().select('-password -email -__v -coins -role')
		const user = await User.findOne({ name }).select('-password -email -__v -role')

		if (!user) return res.status(404).json({ message: 'Пользователь не найден' })

		if (user.coins < coins) return res.status(404).json({ message: 'На счету не достаточно монет' })

		const activeUsers = users.filter(({ playInGame }) => playInGame)

		if (!activeUsers.length) return res.status(404).json({ message: 'Пользователи не найдены' })

		if (!activeUsers.every((serverUser) => activeUsers.find((user) => user.name === serverUser.name))) {
			return res.status(404).json({ message: 'Не допустимые пользователи' })
		}

		user.coins = user.coins - coins
		await user.save()

		const bet = new Bet({
			name,
			betNames: usersBet,
			coins,
			win: null,
		})

		await bet.save()

		res.status(201).json({
			id: user.id,
			role: user.role,
			name: user.name,
			coins: user.coins,
		})
	} catch (e) {
		console.log('e', e)
		res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
	}
})

// добавить новую ставку
router.post('/close', [auth, check('winUser', 'Нет поля winUser').exists()], async (req: any, res: any) => {
	try {
		const { winUser } = req.body
		const { role } = req.user

		if (role !== 'ADMIN') return res.status(403).json({ message: 'Нет доступа' })

		const users = await User.find({ playInGame: true }).select('-password -email -__v -role')

		if (!users) return res.status(404).json({ message: 'Пользователи не найдены' })

		// Find all Bets where winUser exists in the betNames array and win is null
		const betsToUpdate = await Bet.find({ betNames: winUser, win: null })

		// Update the win field of those Bets based on the existence of winUser in the betNames array
		await Bet.updateMany({ betNames: winUser, win: null }, { $set: { win: true } })

		await Bet.updateMany({ betNames: { $ne: winUser }, win: null }, { $set: { win: false } })

		await User.updateOne({ name: winUser }, { $set: { playInGame: false } })

		for (let bet of betsToUpdate) {
			let coinsToAdd = bet.betNames.length > 1 ? bet.coins * 2 : bet.coins * users.length
			await User.updateOne({ name: bet.name }, { $inc: { coins: coinsToAdd } })
		}
		res.status(201).json({ message: 'Ставка закрыта' })
	} catch (e) {
		console.log('e', e)
		res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
	}
})

export default router
