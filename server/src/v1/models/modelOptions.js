/*
使用 schemaOptions 选项对象可以让我们：

在将文档转换为 JSON 或对象格式时包含虚拟字段。
自动管理文档的创建和更新时间，方便跟踪数据的历史。 */

exports.schemaOptions = {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  timestamp: true
}