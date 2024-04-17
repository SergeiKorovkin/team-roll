"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const Bet_1 = __importDefault(require("../models/Bet"));
const User_1 = __importDefault(require("../models/User"));
const { check } = require('express-validator');
const router = (0, express_1.Router)();
// получить историю ставок
router.get('/history', auth_middleware_1.default, async (req, res) => {
    try {
        const bets = await Bet_1.default.find();
        return res.status(200).json(bets.reverse());
    }
    catch (e) {
        console.log('e', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
// добавить новую ставку
router.post('/bet', [auth_middleware_1.default, check('coins', 'Нет поля coins').exists()], async (req, res) => {
    try {
        const { coins, usersBet } = req.body;
        const { name } = req.user;
        if (coins <= 0 || usersBet.length === 0)
            return res.status(404).json({ message: 'Не надо так' });
        const users = await User_1.default.find().select('-password -email -__v -coins -role');
        const user = await User_1.default.findOne({ name }).select('-password -email -__v -role');
        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' });
        if (user.coins < coins)
            return res.status(404).json({ message: 'На счету не достаточно монет' });
        const activeUsers = users.filter(({ playInGame }) => playInGame);
        if (!activeUsers.length)
            return res.status(404).json({ message: 'Пользователи не найдены' });
        if (!activeUsers.every((serverUser) => activeUsers.find((user) => user.name === serverUser.name))) {
            return res.status(404).json({ message: 'Не допустимые пользователи' });
        }
        user.coins = user.coins - coins;
        await user.save();
        const bet = new Bet_1.default({
            name,
            betNames: usersBet,
            coins,
            win: null,
        });
        await bet.save();
        res.status(201).json({
            id: user.id,
            role: user.role,
            name: user.name,
            coins: user.coins,
        });
    }
    catch (e) {
        console.log('e', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
// удалить ставку
router.delete('/bet/:id', [auth_middleware_1.default], async (req, res) => {
    try {
        const { id } = req.params;
        const bet = await Bet_1.default.findById(id);
        if (!bet)
            return res.status(404).json({ message: 'Ставка не найдена' });
        const user = await User_1.default.findOne({ name: bet.name }).select('-password -email -__v -role');
        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' });
        if (bet.win)
            return res.status(400).json({ message: 'Ставка закрыта' });
        await Bet_1.default.findByIdAndDelete(id);
        user.coins = user.coins + bet.coins;
        await user.save();
        res.status(204).json(null);
    }
    catch (e) {
        console.log('e', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
// Выбрать победителя
router.post('/close', [auth_middleware_1.default, check('winUser', 'Нет поля winUser').exists()], async (req, res) => {
    try {
        const { winUser } = req.body;
        const { role } = req.user;
        if (role !== 'ADMIN')
            return res.status(403).json({ message: 'Нет доступа' });
        const users = await User_1.default.find().select('-password -email -__v -role');
        if (!users)
            return res.status(404).json({ message: 'Пользователи не найдены' });
        const allBets = await Bet_1.default.find({ win: null });
        const uniqueUsernamesFromBets = [...new Set(allBets.map((bet) => bet.name))];
        // Identify users who did not create any bets
        const usersWithoutBets = users.filter((user) => !uniqueUsernamesFromBets.includes(user.name));
        // Find all Bets where winUser exists in the betNames array and win is null
        const betsToUpdate = await Bet_1.default.find({ betNames: winUser, win: null });
        // Update the win field of those Bets based on the existence of winUser in the betNames array
        await Bet_1.default.updateMany({ betNames: winUser, win: null }, { $set: { win: true } });
        await Bet_1.default.updateMany({ betNames: { $ne: winUser }, win: null }, { $set: { win: false } });
        await User_1.default.updateOne({ name: winUser }, { $set: { playInGame: false } });
        for (let bet of betsToUpdate) {
            let coinsToAdd = bet.betNames.length > 1 ? bet.coins * 2 : bet.coins * users.filter((user) => user.playInGame).length;
            await User_1.default.updateOne({ name: bet.name }, { $inc: { coins: coinsToAdd } });
        }
        // Decrement 200 coins from each user who didn't place any bet
        await User_1.default.updateMany({
            name: { $in: usersWithoutBets.map((user) => user.name) },
            coins: { $gt: 0 },
        }, {
            $inc: { coins: -200 },
        });
        res.status(201).json({ message: 'Ставка закрыта' });
    }
    catch (e) {
        console.log('e', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
exports.default = router;
//# sourceMappingURL=bets.routes.js.map