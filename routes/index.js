var User = require('../model/User');
var mongodb = require('../model/db');

module.exports = function (app) {
    //首页
    app.get('/',function (req,res) {
        var page = parseInt(req.query.page) || 1;
        User.getTen(null,page,function (err,docs,total) {
            if(err){
                return res.redirect('/');
            }
            res.render('index',{
              title:'首页',
                page:page,
                isFirstPage: (page-1)*10 == 0,
                isLastPage: (page-1)*10 + docs.length == total,
                docs:docs
            })
        })
    })
    //添加信息页面
    app.get('/reg',function (req,res) {
        res.render('reg',{
            title:'添加信息'
        })
    })
    //添加信息行为然后展示信息
    app.post('/reg',function (req,res) {
        var user = new User({
            username:req.body.username,
            tel:req.body.tel,
            email:req.body.email,
        })
            var newUser = new User(user);
            newUser.save(function (err) {
                if(err){
                    return res.redirect('/reg');
                }
                return res.redirect('/');
            })
        })
        //搜索信息界面
        app.get('/search',function (req,res) {
            User.search(req.query.keyword,function (err,docs) {
                console.log(req.query.keyword);
                if(err){
                    return res.redirect('/');
                }
                return res.render('search',{
                    title:'搜索结果',
                    docs:docs
                })
            })
        })
        //删除
        app.get('/remove/:username/:tel/:email',function (req,res) {
            User.remove(req.params.username,req.params.tel,req.params.email,function (err) {
              if(err){
                  return res.redirect('/error')
              }
              return res.redirect('/');
            })
        })
        //编辑修改路由
        app.get('/edit/:username/:tel/:email',function (req,res) {
            User.edit(req.params.username,req.params.tel,req.params.email,function (err,doc) {
                if(err){
                    return res.redirect('/');
                }
                return res.render('edit',{
                    title:'编辑页面',
                    doc:doc
                })
            })
        })
        //编辑修改行为
        app.post('/edit/:username/:tel/:email',function (req,res) {
            User.update(req.params.username,req.body.tel,req.body.email,function (err,doc) {
                var url = encodeURI('/edit/' + req.params.username + '/' + req.params.tel + '/' + req.params.email);
                if(err){
                    return res.redirect('/');
                }
                return res.redirect(url);
            })
        })


    }

