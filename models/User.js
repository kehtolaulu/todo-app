const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    todos: [{ type: Types.ObjectId, ref: 'ToDo' }]
})

module.exports = model('User', schema)
