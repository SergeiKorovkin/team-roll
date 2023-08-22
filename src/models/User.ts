import { model, Schema } from 'mongoose'

const schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true, unique: true },
	role: { type: String, required: true },
	avatar: { type: String },
	coins: { type: Number, required: true },
	playInGame: { type: Boolean, required: true },
})

export default model('User', schema)
