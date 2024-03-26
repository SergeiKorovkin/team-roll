"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.check)('email', 'Не корректный email').isEmail(),
    (0, express_validator_1.check)('name', 'Нет имени').exists(),
    (0, express_validator_1.check)('password', 'Минимальная длинна пароля 6 символов').isLength({ min: 6 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Не корректные данные при регистрации',
            });
        }
        const { email, password, name } = req.body;
        const candidate = await User_1.default.findOne({ email });
        if (candidate)
            return res.status(400).json({ message: 'Такой пользователь уже существует' });
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = new User_1.default({ email, password: hashedPassword, name, playInGame: true, role: 'USER', coins: 10000 });
        await user.save();
        res.status(201).json({ message: 'Пользователь создан' });
    }
    catch (e) {
        console.log('res', e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
router.post('/login', [(0, express_validator_1.check)('email', 'Введите корректный email').normalizeEmail().isEmail(), (0, express_validator_1.check)('password', 'Введите пароль').exists()], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Не корректные данные при входе в систему',
            });
        }
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
            name: user.name,
        }, config_1.default.get('jwtSecret'), { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                coins: user.coins,
                avatar: user.avatar,
            },
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуй снова' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map