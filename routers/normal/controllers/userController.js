
const DB = require('../../../modules/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const keyForToken = "secret"

exports.userSignup = (req,res,next) =>{

    const username = req.body.username
    const password = req.body.password

    DB.find('user',{username: username}, (error, user) =>{
        if (error) {
            return res.status(500).json({
                error: err
            })
        }

        if(user.length > 0){
            res.status(409).json({
                message:'Username exists.'
            })
        }else{

            bcrypt.hash(password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = {
                        _id: new DB.ObjectID,
                        username: username,
                        createTime: new Date(),
                        status: 0,
                        password: hash
                    }

                    const token = jwt.sign({
                        username: user.username,
                        _id: user._id,
                    },keyForToken,{
                        expiresIn: "72h",
                    });

                    //資料傳進來的格式不符合email的re就會傳出error
                    DB.insert('user', user, (error, data) =>{
                        if (error) {
                            return res.status(500).json({
                                error : err
                            })
                        }
                        res.status(201).json({
                            message:'User created successfully.',
                            user: {
                                _id: user._id,
                                username: user.username,
                                createTime: user.createTime,
                                status: user.status
                            },
                            token: token
                        });
                    })
                }
            })
        }

    })
}

exports.userLogin = (req,res,next) =>{

    const username = req.body.username
    const password = req.body.password

    DB.find('user',{username: username}, (error, user) =>{
        if (error) {
            return res.status(500).json({
                error: err
            })
        }

        console.log(user);
        if(user.length < 1){
            return res.status(401).json({
                message:'This username does not existing.'
            });
        }
        bcrypt.compare(password, user[0].password,(err, result)=>{
            if(err){
                return res.status(401).json({
                    message:'This email is not vaild or not existing!'
                });
            }

            if(result){
                const token = jwt.sign({
                        username: user[0].username,
                        _id: user[0]._id,
                    },keyForToken,{
                        expiresIn: "72h",
                    });
                return res.status(200).json({
                    message:'Login successfully',
                    user: {
                        _id: user[0]._id,
                        username: user[0].username,
                        createTime: user[0].createTime,
                        status: user[0].status
                    },
                    token: token
                })
            }
            res.status(401).json({
                message:"Auth failed, password is incorrect.",
            });
        })

    })

}


exports.getUserInfoById = (req,res,next) =>{

    const userId = req.params.userId
    var _id;

    try {
        _id = DB.ObjectID(userId)

        DB.find('user',{_id: _id}, (error, user) =>{
            if (error) {
                return res.status(500).json({
                    message:'Get user info failed, cause database connection.'
                })
            }

            if(user.length <= 0){
                res.status(500).json({
                    message:'Get nothing with this user id.'
                })
            } else {
                res.status(200).json({
                    message:'Get user info sucessfully',
                    user: {
                        _id: user[0]._id,
                        username: user[0].username,
                        createTime: user[0].createTime,
                        status: user[0].status
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of user id is incorrect.'
        })
    }

}


exports.userDelete = (req,res,next) =>{
    const userId = req.params.userId
    var _id;

    try {
        _id = DB.ObjectID(userId)

        DB.find('user',{_id: _id}, (error, user) =>{
            if (error) {
                return res.status(500).json({
                    message:'user delete failed, cause database connection.'
                })
            }

            if(user.length <= 0){
                res.status(500).json({
                    message:'user id is missing or incorrect.'
                })
            } else {
                DB.delete('user', {
                    "_id": _id
                }, (error, data) => {
                    if (error) {
                        res.status(500).json({
                            message:'user delete failed.'
                        })
                    } else {
                        res.status(200).json({
                            message:'user delete sucessfully',
                            deleteUser: {
                                _id: user[0]._id,
                                status: user[0].status,
                                username: user[0].username,
                                createTime: user[0].createTime,
                                deleteTime: new Date()
                            }
                        })
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of user id is incorrect.'
        })
    }
}