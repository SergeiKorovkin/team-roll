import { Router } from 'express'
import User from '../models/User'
import auth from '../middleware/auth.middleware'
import { check } from 'express-validator'

const router = Router()

// Добавление изображения для пользователя
router.get('/', [auth], async (req: any, res: any) => {
	try {
		const { id } = req.user
		const user = await User.findOne({ _id: id })

		if (!user) return res.status(404).json({ message: 'Пользователь не найден' })

		res.status(200).json({
			id: user.id,
			role: user.role,
			name: user.name,
			coins: user.coins,
			avatar: user.avatar,
		})
	} catch (e) {
		console.log('res', e)
		res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
	}
})

// Добавление изображения для пользователя
router.post(
	'/',
	[auth, check('avatar', 'Формат должен быть base64').exists().isBase64()],
	async (req: any, res: any) => {
		try {
			const { avatar } = req.body
			const { id } = req.user
			const user = await User.findOne({ _id: id })

			if (!user) return res.status(404).json({ message: 'Пользователь не найден' })
			user.avatar = avatar
			await user.save()

			res.status(200).json({
				id: user.id,
				role: user.role,
				name: user.name,
				coins: user.coins,
				avatar: user.avatar,
			})
		} catch (e) {
			console.log('res', e)
			res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
		}
	}
)

// Получение списка пользователей
router.get('/allusers', [auth], async (req: any, res: any) => {
	try {
		const users = await User.find()
		const usersInfo = users.map(({ name, playInGame, _id, coins }) => ({
			name,
			playInGame,
			id: _id,
			coins,
		}))

		res.status(200).json(usersInfo)
	} catch (e) {
		console.log('res', e)
		res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
	}
})

// Получение списка пользователей
router.get('/allusers/avatars', [auth], async (req: any, res: any) => {
	try {
		const users = await User.find()
		const usersInfo = users.map(({ name, _id, coins, avatar }) => ({
			name,
			id: _id,
			avatar,
		}))

		res.status(200).json(usersInfo)
	} catch (e) {
		console.log('res', e)
		res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
	}
})

// Редактирование списка того, кто будет играть
router.post(
	'/allusers',
	[auth, check('id', 'Нет поля id').exists(), check('playInGame', 'Нет поля playInGame').exists()],
	async (req: any, res: any) => {
		try {
			const { id, playInGame } = req.body
			const { role } = req.user

			if (role !== 'ADMIN') return res.status(403).json({ message: 'Нет прав доступа' })
			const user = await User.findOne({ _id: id })

			if (!user) return res.status(404).json({ message: 'Пользователь не найден' })
			user.playInGame = playInGame
			await user.save()

			res.status(200).json({ message: 'Настройка изменена' })
		} catch (e) {
			console.log('res', e)
			res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' })
		}
	}
)

export default router
