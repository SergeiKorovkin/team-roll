import { model, Schema } from 'mongoose'

const schema = new Schema({
	name: { type: String, required: true },
	betNames: { type: Array, required: true },
	win: { type: Boolean || null, default: null },
	coins: { type: Number, required: true },
})

export default model('Bets', schema)
