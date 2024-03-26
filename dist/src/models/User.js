"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    avatar: { type: String },
    coins: { type: Number, required: true },
    playInGame: { type: Boolean, required: true },
});
exports.default = (0, mongoose_1.model)('User', schema);
//# sourceMappingURL=User.js.map