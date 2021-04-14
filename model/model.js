//引入mongoose
const mongoose = require("./index")

//定义用户数据规则
var Userschema = mongoose.Schema({
    username: String,
    password: String,
    create_time:Number,
    phone:Number,
    email:String,
    role_id:String
})

// 将用户数据模型将模型暴露出去
exports.users = mongoose.model("users", Userschema, "users")

//分类列表模型
exports.goods = mongoose.model('good', mongoose.Schema({
    parentId: String,
    name: String
}), 'good')

//商品列表模型
exports.goodInfo = mongoose.model('goodinfo', mongoose.Schema({
    name: String,
    status: String,
    price: Number,
    desc: String,
    info:String,
    parentId:String,
    imgUrl: Array,
    kind:Array
}), 'goodinfo')

//用户权限模型
exports.role = mongoose.model('role', mongoose.Schema({
    name: String,
    create_time:String,
    auth_time:String,
    auth:String,
    menus:Array,
}), 'role')