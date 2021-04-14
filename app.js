const express = require("express")
const router = require("./routers/router")
const app = express()
const path = require('path')


//获取post参数配置
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//开放public静态资源目录
app.use('/public', express.static(path.join(__dirname, 'public')))


app.use(router)
app.listen(5000, () => {
    console.log('服务器启动成功')
})