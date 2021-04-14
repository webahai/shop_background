//引入相关配置
const express = require("express")
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const md5 = require('md5')
const path = require('path')

const dir = path.join(__dirname, '../public')

//加密字符
const str = md5('25sat)`8%#52@O*%(&#&^<.,?')
//接收数据模型
var {
       users,
       goods,
       goodInfo,
       role
} = require("../model/model")


//设置请求头跨域
router.all('*', (req, res, next) => {
       res.set({
              'Access-Control-Allow-Credentials': true, //允许后端发送cookie
              'Access-Control-Allow-Origin': req.headers.origin || '*', //任意域名都可以访问,或者基于我请求头里面的域
              'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //设置请求头格式和类型
              'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS', //允许支持的请求方式
              'Content-Type': 'application/json; charset=utf-8' //默认与允许的文本格式json和编码格式
       })
       next()
})

//登录请求接口
router.get('/login', (req, res) => {
       users.findOne({
              username: req.query.username,
              password: req.query.password
       }, (err, data) => {
              if (!data) {
                     return res.send({
                            status: 1,
                            message: '数据不存在',
                     })
              }
              data.password = md5(str + data.password)
              return res.send({
                     status: 0,
                     data
              })
       })
})


//商品列表查询接口
router.get('/goods', (req, res) => {
       let {
              parentId,
              findparent
       } = req.query

       if (findparent !== '1') {
              goods.find({
                     parentId
              }, (error, data) => {
                     if (!data) {
                            return res.send({
                                   status: 1,
                                   message: '查询的商品不存在',
                                   data: JSON.stringify(error)
                            })
                     } else {
                            return res.send({
                                   status: 0,
                                   data: data,
                                   message: '查询商品成功'
                            })
                     }
              })
       } else {
              goods.find({
                     _id: parentId
              }, (error, data) => {
                     if (!data) {
                            return res.send({
                                   status: 1,
                                   message: '查询的商品不存在',
                                   data: JSON.stringify(error)
                            })
                     } else {
                            return res.send({
                                   status: 0,
                                   data: data,
                                   message: '查询商品成功'
                            })
                     }
              })
       }
})
//商品列表添加接口
router.get('/addgoods', async (req, res) => {
       //接收形参
       let {
              name,
              parentId
       } = req.query

       //判断数据是否已经添加过
       var result = await goods.findOne({
              name,
              parentId
       })

       //判断添加的是不是空数据
       if (!name || !parentId) {
              return res.send({
                     status: 1,
                     message: '不能增加空数据'
              })

              //如果有数据了，输出这个结果
       } else if (result) {
              return res.send({
                     status: 1,
                     message: '名字重复了'
              })
       }
       //添加数据
       goods.create({
              name,
              parentId
       }, (err, doc) => {
              if (!doc) {
                     return res.send({
                            status: 1,
                            message: '本次数据未能添加成功'
                     })
              } else {
                     return res.send({
                            status: 0,
                            message: '数据添加成功,但是不给你看'
                     })
              }
       })
})
//商品列表修改接口
router.get('/updategoods', (req, res) => {
       let {
              _id,
              name
       } = req.query
       if (!name) {
              return res.send({
                     status: 1,
                     message: '修改的名字不能是空的'
              })
       }
       goods.updateOne({
              _id
       }, {
              name
       }, (err) => {
              if (!err) {
                     return res.send({
                            status: 0,
                            message: '数据修改成功'
                     })
              } else {
                     return res.send({
                            status: 1,
                            message: err
                     })
              }
       })
})

//商品数据获取接口
router.get('/shop', async (req, res) => {
       let {
              pageNum,
              pageSize
       } = req.query

       //先确认总共有多少商品数据
       let result = await goodInfo.find({}, (err, data) => {
              return data
       })

       //返回分页的数据
       goodInfo.find({}, (err, data) => {
              if (!data) {
                     return res.send(err)
              }
              return res.send({
                     status: 0,
                     data: data,
                     length: JSON.stringify(result.length)
              })
       }).skip(Number((pageNum - 1) * pageSize)).limit(Number(pageSize))
})

//商品数据搜索请求
router.get('/shop/search', async (req, res) => {
       let {
              searchtype,
              pageNum,
              pageSize,
              key
       } = req.query
       if (searchtype === 'searchName') {
              //先确认总共有多少商品数据
              let result = await goodInfo.find({
                     name: {
                            $regex: new RegExp(key)
                     }
              }, (err, data) => {
                     return data
              })

              goodInfo.find({
                     name: {
                            $regex: new RegExp(key)
                     }
              }, (error, data) => {
                     if (!data) {
                            return res.send({
                                   status: 1,
                                   message: error,
                            })
                     }
                     return res.send({
                            status: 0,
                            data,
                            length: JSON.stringify(result.length)
                     })
              }).skip(Number((pageNum - 1) * pageSize)).limit(Number(pageSize)).sort()
       } else if (searchtype === 'searchDesc') {
              //先确认总共有多少商品数据
              let result = await goodInfo.find({
                     name: {
                            $regex: new RegExp(key)
                     }
              }, (err, data) => {
                     return data
              })
              goodInfo.find({
                     desc: {
                            $regex: new RegExp(key)
                     }
              }, (error, data) => {
                     if (!data) {
                            return res.send({
                                   status: 1,
                                   message: error,
                            })
                     }
                     return res.send({
                            status: 0,
                            data,
                            length: JSON.stringify(result.length)
                     })
              }).skip(Number((pageNum - 1) * pageSize)).limit(Number(pageSize)).sort()
       } else {
              return res.send({
                     status: 1,
                     message: '请检查参数'
              })
       }
})

//商品上架下架状态请求
router.get('/shop/stateupd', (req, res) => {
       let {
              _id,
              status
       } = req.query
       // res.send(_id+'-------'+status)
       goodInfo.updateOne({
              _id
       }, {
              status
       }, (err, data) => {
              if (!data) {
                     return res.send({
                            status: 1,
                            message: JSON.stringify(err)
                     })
              } else {
                     return res.send({
                            status: 0,
                            message: JSON.stringify('数据修改成功')
                     })
              }
       })
})

//上传图片接口(多个文件上传)
router.post('/upload/image', multer({
       //上传文件保存到哪个目录
       dest: 'public/image',
       fileFilter: (req, file, cb) => {
              if (file.mimetype.indexOf('image') < 0) {
                     cb('文件类型必须是图片', false)
              } else if (file.size > 1024 * 1024) {
                     cb('图片大小不能大于1M', false)
              } else {
                     cb(null, true)
              }
       }
       //限定上传的文件是任何类型并且可以多个    
}).any(), (req, res) => {

       /*
[{
        "fieldname": "",
        "originalname": "1.png",
        "encoding": "7bit",
        "mimetype": "image/png",
        "destination": "public/image",
        "filename": "b463ca403dfdef627f750e655096f7d9",
        "path": "public\\image\\b463ca403dfdef627f750e655096f7d9",
        "size": 81422
    }]
*/
       let imginfo = []
       //对文件进行遍历改名
       for (let i = 0; i < req.files.length; i++) {
              let oldname = req.files[i].path
              let newname = req.files[i].destination + '/' + req.files[i].size + req.files[i].originalname
              fs.renameSync(oldname, newname)
              let name = req.files[i].size + req.files[i].originalname
              let url = `http://localhost:5000/${req.files[i].destination}/${name}`
              imginfo.push({
                     name,
                     url
              })
       }
       res.send(...imginfo)
})

//商品数据添加接口
router.post('/addshop', (req, res) => {
       let {
              desc,
              info,
              kind,
              name,
              price,
              imgUrl
       } = req.body
       let parentId;
       if (kind[1]) {
              parentId = kind[1]
       } else {
              parentId = kind[0]
       }
       // console.log(req.body)
       goodInfo.create({
              status: 0,
              name,
              desc,
              info,
              price,
              parentId,
              imgUrl,
              kind
       }, (err, data) => {
              if (!data) {
                     return res.send({
                            status: 0,
                            message: err
                     })
              } else {
                     return res.send({
                            status: 0,
                            message: '商品添加成功'
                     })
              }
       })

})

//图片删除接口
router.post('/delate/image', (req, res) => {
       let {
              name
       } = req.body
       fs.unlink(dir + '/image/' + name, (err) => {
              if (err) {
                     return res.send({
                            status: 1,
                            message: '文件删除失败' + err
                     })
              } else {
                     res.send({
                            status: 0,
                            message: '文件删除成功'
                     })
              }
       })
})

//商品修改请求(根据_id查询出来数据进行修改)
router.post('/shopupdata', (req, res) => {
       let {
              _id,
              desc,
              info,
              kind,
              name,
              price,
              imgUrl
       } = req.body
       goodInfo.updateOne({
              _id
       }, {
              name,
              desc,
              info,
              kind,
              price,
              kind,
              imgUrl,
       }, (err) => {
              if (err) {
                     res.send({
                            status: 1,
                            message: err
                     })
              } else {
                     res.send({
                            status: 0,
                            message: '数据修改成功'
                     })
              }
       })
})

//获取用户授权的数据接口
router.get('/role', (req, res) => {
       let {_id} = req.query
       if (_id) {
              role.findOne({
                     _id
              }, (err, data) => {
                     if (!data) {
                            return res.send({
                                   status: 1,
                                   message: '查询失败'
                            })
                     }
                     return res.send({
                            status: 0,
                            data
                     })
              })
              return
       }

       role.find({}, (err, data) => {
              if (!data) {
                     return res.send({
                            status: 1,
                            message: '没有查询到数据'
                     })
              } else {
                     return res.send({
                            status: 0,
                            data
                     })
              }
       })
})

//创建角色接口
router.get('/createrole', async (req, res) => {
       let {
              name
       } = req.query
       let result = await role.findOne({
              name
       })
       if (result) {
              return res.send({
                     status: 1,
                     message: '角色名字重复了'
              })
       }
       role.create({
              name,
              menus: [],
              create_time: Date.now(),
              auth_time: null,
              auth: null
       }, (err) => {
              if (err) {
                     res.send({
                            status: 1,
                            message: '角色创建失败'
                     })
              } else {
                     res.send({
                            status: 0,
                            message: '角色创建成功'
                     })
              }
       })
})

//修改角色权限接口
router.get('/roleset', (req, res) => {
       let {
              menus,
              _id,
              auth
       } = req.query
       role.updateOne({
              _id
       }, {
              menus,
              auth_time: Date.now(),
              auth
       }, (err) => {
              if (err) {
                     res.send({
                            status: 1,
                            message: '权限修改失败'
                     })
              } else {
                     res.send({
                            status: 0,
                            message: '权限修改成功'
                     })
              }
       })

})

//用户数据返回接口
router.get('/usersList', async (req, res) => {
       let citem = []
       let roles = []
       let result = await role.find({}, (err, data) => {
              roles = data
       })
       if (result[0]) {
              return users.find({}, (err, data) => {
                     if (!data) {
                            return res.send({
                                   status: 1,
                                   message: err
                            })
                     }
                     data.map((item) => {
                            item.password = md5(str + item.password)
                            return citem.push(item)
                     })
                     return res.send({
                            status: 0,
                            data: {
                                   users: citem,
                                   roles
                            }
                     })
              })
       }
})

//删除用户接口
router.post('/userdeleter', (req, res) => {
       let {
              _id
       } = req.body
       if (_id === '6073f7ef1e0edc0f6026ca4b') {
              return res.send({
                     status: 1,
                     message: '权限不够'
              })
       }
       users.deleteOne({
              _id
       }, (err, data) => {
              if (err) {
                     return res.send({
                            status: 1,
                            message: '删除失败'
                     })
              }
              res.send({
                     status: 0,
                     message: '删除成功'
              })
       })
})

//用户注册接口
router.post('/register', async (req, res) => {
       let {
              username,
              password,
              phone,
              email,
              role_id
       } = req.body
       let excit = await users.findOne({
              username
       })
       if (excit) {
              return res.send({
                     status: 1,
                     message: '名字重复了，换一个吧'
              })
       }
       users.create({
              username,
              password,
              phone,
              email,
              role_id,
              create_time: Date.now()
       }, (err, doc) => {
              if (err) {
                     return res.send({
                            status: 1,
                            message: '注册失败'+err
                     })
              }
              return res.send({
                     status: 0,
                     message: '注册成功'
              })
       })
})

//用户修改接口
router.post('/userupdate', (req, res) => {
       let {
              _id,
              username,
              phone,
              email,
              role_id
       } = req.body
       if (_id === '6073f7ef1e0edc0f6026ca4b') {
              return res.send({
                     status: 1,
                     message: '权限不够'
              })
       }

       users.updateOne({
              _id
       }, {
              username,
              phone,
              email,
              role_id
       }, (err, doc) => {
              if (err) {
                     return res.send({
                            status: 1,
                            message: '修改失败'
                     })
              }
              return res.send({
                     status: 0,
                     message: '修改成功'
              })
       })

})
module.exports = router;