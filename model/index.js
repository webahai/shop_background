//引入mongoose
const mongoose = require("mongoose")
// 配置连接属性，数据库名字
var options={
    db_user:"test1",
    db_pwd:123456,
    db_host:"127.0.0.1",
    db_port:27017,
    db_name:"test1"
}
// 连接test1数据库
mongoose.connect(`mongodb://${options.db_user}:${options.db_pwd}@${options.db_host}:${options.db_port}/${options.db_name}?authSource=test1`,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('数据库连接成功'))
.catch(() => console.log('数据库连接失败'))
//连接成功后将mongoose暴露出去
module.exports=mongoose;