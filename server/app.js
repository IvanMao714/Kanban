const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// var：作用域是函数级别的（function-scoped）。如果在函数中声明一个 var 变量，它只在该函数内可访问。如果在全局范围或代码块内声明，它将被提升到全局或函数作用域。
// const：作用域是块级别的（block-scoped）。如果在 { } 代码块中声明，只在该块内可访问。
// 在现代 JavaScript 中，建议优先使用 const，需要重新赋值的情况则使用 let，而避免使用 var。
const cores = require('cors');
//是一种在 Node.js 中加载 cors 中间件的写法，通常用于 Express 应用中，以便配置跨域资源共享（CORS）。
//CORS（Cross-Origin Resource Sharing）是一种机制，允许来自不同源的浏览器请求资源。由于浏览器的同源策略限制，不同域的网页默认不能访问其他域的资源，这时 cors 模块可以帮助解决这个问题。
const app = express();

app.use(cores());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./src/v1/routes/index'));

module.exports = app;
