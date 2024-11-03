const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
// validate 函数用于处理由 express-validator 库验证后的请求错误。如果请求中包含验证错误，函数会立即返回状态码 400 和错误信息；否则，将继续执行下一个中间件或路由处理器。
exports.validate = (req, res, next) => {
  // validationResult 是 express-validator 库中的一个函数，用于收集和检查所有请求中字段的验证错误。它在使用 express-validator 进行验证时，主要验证请求中的 参数、查询、请求体 中的字段是否符合要求的规则，如字段类型、长度、格式等。
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
// isObjectId：用于验证字符串是否符合 MongoDB ObjectId 格式，确保请求中的 id 参数格式正确。
exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value)