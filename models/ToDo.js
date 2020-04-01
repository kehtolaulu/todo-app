const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  text: {type: String, required: true},
  status: {type: String, required: true},
  date: {type: Date, default: Date.now},
  owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('ToDo', schema)
