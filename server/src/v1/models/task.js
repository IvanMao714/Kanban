const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const taskSchema = new Schema({
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    // default: () => {
    //     const now = new Date();
    //     now.setDate(now.getDate() + 14); // 设置为当前日期加 7 天
    //     return now;
    // }
    default: null
  },
  Pority: {
    type: String,
    default: 'normal'
  },
  Tags: {
    type: [String],
    default: ['normal',''] // 默认值为空数组
  },
  content: {
    type: String,
    default: ''
  },
  position: {
    type: Number
  },
  progress:{
    type: Number,
    default: 0
  }
}, schemaOptions)

module.exports = mongoose.model('Task', taskSchema)