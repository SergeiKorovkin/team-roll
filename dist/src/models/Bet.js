"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    betNames: { type: Array, required: true },
    win: { type: Boolean || null, default: null },
    coins: { type: Number, required: true },
});
exports.default = (0, mongoose_1.model)('Bets', schema);
//# sourceMappingURL=Bet.js.map