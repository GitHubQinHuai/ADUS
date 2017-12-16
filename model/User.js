/**
 * Created by Administrator on 2017/12/15.
 */
var mongodb =require('./db');
function User(user) {
    this.username = user.username;
    this.tel = user.tel;
    this.email = user.email;
}
module.exports = User;
//保存数据
User.prototype.save = function (callback) {
    var user = {
        username:this.username,
        tel:this.tel,
        email:this.email
    }
    console.log(user);
    mongodb.open(function (err,db) {
        if (err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(user,{safe:true},function (err, doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,doc);
            })

        })
    })
}
//获取所有数据
User.getTen = function (username,page,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback();
                }
            var query = {}
            if(username){
                query.username = username;
                }
                collection.count(query,function (err,total) {
                    if(err){
                        mongodb.close();
                        return callback(err);
                    }
                    collection.find(query,{
                        skip:(page-1)*10,
                        limit:10
                    }).toArray(function (err,docs) {
                        mongodb.close();
                        if(err){
                            return callback(err);
                        }
                        return callback(null,docs,total);
                    })
                })
            })
        })

    }
//获取到单一的数据
User.getOne = function(username,tel,email,callback){
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                username:username,
                tel:tel,
                email:email
            },function (err,doc) {
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                if(doc){
                    collection.update({
                        username:username,
                        tel:tel,
                        email:email
                    },{
                        $inc:{pv:1}
                    },function (err) {
                        mongodb.close();
                    })
                }
                return callback(null,doc)
            })

        })
    })

}
//搜索
User.search = function (keyword,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var newRegex = new RegExp(keyword,"i");
            collection.find({
                username:newRegex
            },{
                username:1,
                tel:1,
                email:1
            }).toArray(function (err, docs) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,docs)
            })
        })
    })

}
//删除数据
User.remove = function (username,tel,email,callback) {
    mongodb.open(function (err,db) {
       if(err){
           return callback(err);
       }
       db.collection('users',function (err,collection) {
           if(err){
               mongodb.close();
               return callback(err);
           }
           collection.remove({
               username:username,
               tel:tel,
               email:email
           },{
               w:1
           },function (err) {
               mongodb.close();
               if(err){
                   return callback(err);
               }
               return callback(err);
           })
       })
    })
}
//修改数据
User.edit = function (username,tel,email,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback (err);
            }
            collection.findOne({
                username :username,
                tel:tel,
                email:email
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
User.update = function(username,tel,email,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                username:username,
                tel:tel,
                email:email
            },{
                $set:{username:username,
                        tel:tel,
                        email:email
                }
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}