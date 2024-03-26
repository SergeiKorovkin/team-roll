"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Добавление изображения для пользователя
router.get('/', [auth_middleware_1.default], async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User_1.default.findOne({ _id: id });
        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' });
        res.status(200).json({
            id: user.id,
            role: user.role,
            name: user.name,
            coins: user.coins,
            avatar: user.avatar,
        });
    }
    catch (e) {
        console.log('res', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
// Добавление изображения для пользователя
router.post('/', [auth_middleware_1.default, (0, express_validator_1.check)('avatar', 'Формат должен быть base64').exists().isBase64()], async (req, res) => {
    try {
        const { avatar } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findOne({ _id: id });
        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' });
        user.avatar = avatar;
        await user.save();
        res.status(200).json({
            id: user.id,
            role: user.role,
            name: user.name,
            coins: user.coins,
            avatar: user.avatar,
        });
    }
    catch (e) {
        console.log('res', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
// Получение списка пользователей
router.get('/allusers', [auth_middleware_1.default], async (req, res) => {
    try {
        const users = await User_1.default.find();
        const usersInfo = users.map(({ name, playInGame, _id, coins }) => ({
            name,
            playInGame,
            id: _id,
            coins,
        }));
        res.status(200).json(usersInfo);
    }
    catch (e) {
        console.log('res', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
// Получение списка пользователей
router.get('/allusers/avatars', [auth_middleware_1.default], async (req, res) => {
    try {
        const users = await User_1.default.find();
        const usersInfo = users.map(({ name, _id, coins, avatar }) => ({
            name,
            id: _id,
            avatar,
        }));
        res.status(200).json(usersInfo);
    }
    catch (e) {
        console.log('res', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
// Редактирование списка того, кто будет играть
router.post('/allusers', [auth_middleware_1.default, (0, express_validator_1.check)('id', 'Нет поля id').exists(), (0, express_validator_1.check)('playInGame', 'Нет поля playInGame').exists()], async (req, res) => {
    try {
        const { id, playInGame } = req.body;
        const { role } = req.user;
        if (role !== 'ADMIN')
            return res.status(403).json({ message: 'Нет прав доступа' });
        const user = await User_1.default.findOne({ _id: id });
        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' });
        user.playInGame = playInGame;
        await user.save();
        res.status(200).json({ message: 'Настройка изменена' });
    }
    catch (e) {
        console.log('res', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map