
const DB = require('../../../modules/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const keyForToken = "secret"

// const multiparty = require('multiparty')

const EACH_POINT = 10


exports.userSignup = (req,res,next) =>{

    // const form = new multiparty.Form()

    //form.parse(req, (error, textFields, files) => {


        // const username = textFields.username[0]
        // const password = textFields.password[0]

    const username = req.body.username
    const password = req.body.password

        console.log(username);
        console.log(password);

        DB.find('user',{username: username}, (error, user) =>{
            if (error) {
                return res.status(400).json({
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
                        return res.status(400).json({
                            error: err
                        });
                    }else{
                        const user = {
                            _id: new DB.ObjectID,
                            username: username,
                            createTime: new Date(),
                            status: 0,
                            points: 0,
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
                                return res.status(400).json({
                                    error : err
                                })
                            }
                            res.status(201).json({
                                message:'User created successfully.',
                                user: {
                                    _id: user._id,
                                    username: user.username,
                                    createTime: user.createTime,
                                    status: user.status,
                                    points: user.points,
                                },
                                token: token
                            });
                        })
                    }
                })
            }

        })
    //})

}

exports.userLogin = (req,res,next) =>{

    //const form = new multiparty.Form()

    //form.parse(req, (error, textFields, files) => {

       // const username = textFields.username[0]
        //const password = textFields.password[0]

    const username = req.body.username
    const password = req.body.password
        console.log(username);
        console.log(password);

        DB.find('user',{username: username}, (error, user) =>{
            if (error) {
                return res.status(400).json({
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
                            status: user[0].status,
                            points: user[0].points,

                        },
                        token: token
                    })
                }
                res.status(401).json({
                    message:"Auth failed, password is incorrect.",
                });
            })

        })


    //})




}

exports.updateUsername = (req,res,next) =>{

    //const form = new multiparty.Form()

    //form.parse(req, (error, textFields, files) => {

        // const userId = textFields.userId[0]
        // const newName = textFields.newName[0]

    const userId = req.body.userId
    const newName = req.body.newName

        console.log(userId);
        console.log(newName);

        var _id;

        try {
            _id = DB.ObjectID(userId)

            DB.find('user',{_id: _id}, (error, user) =>{
                if (error) {
                    return res.status(400).json({
                        message:'Get user info failed, cause database connection.'
                    })
                }

                if(user.length <= 0){
                    res.status(400).json({
                        message:'Get nothing with this user id.'
                    })
                } else {
                    console.log(newName);

                    if (newName.trim().length != 0) {
                        DB.find('user',{username: newName}, (error, user02) =>{
                            if (error) {
                                return res.status(400).json({
                                    error: err
                                })
                            }
                            if(user02.length > 0){
                                console.log(user02);
                                res.status(400).json({
                                    message:'Come on,Update new username failed, cause username exists.'
                                })
                            }else{
                                console.log(user);
                                DB.update('user',
                                    {username: user[0].username},
                                    {username: newName},
                                    (error, data) => {
                                        if (error) {
                                            return res.status(400).json({
                                                error: error,
                                                message:'Update username failed, Please try again.'
                                            })
                                        }
                                        res.status(201).json({
                                            message:'Update username successfully.',
                                            user: {
                                                _id: user[0]._id,
                                                username: newName,
                                                createTime: user[0].createTime,
                                                status: user[0].status,
                                                points: user[0].points,
                                            }

                                        })
                                    })
                            }
                        })
                    } else {
                        res.status(400).json({
                            message:'Are you kidding me ? Do you think empty new name is reasonable? .'
                        })
                    }



                }
            })

        } catch (error) {
            res.status(400).json({
                message:'Format of user id is incorrect.'
            })
        }
   // })




}

exports.getUserInfoById = (req,res,next) =>{

    const userId = req.params.userId
    var _id;

    try {
        _id = DB.ObjectID(userId)

        DB.find('user',{_id: _id}, (error, user) =>{
            if (error) {
                return res.status(400).json({
                    message:'Get user info failed, cause database connection.'
                })
            }

            if(user.length <= 0){
                res.status(400).json({
                    message:'Get nothing with this user id.'
                })
            } else {
                res.status(200).json({
                    message:'Get user info sucessfully',
                    user: {
                        _id: user[0]._id,
                        username: user[0].username,
                        createTime: user[0].createTime,
                        status: user[0].status,
                        points: user[0].points,
                    }
                })
            }
        })

    } catch (error) {
        res.status(400).json({
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
                return res.status(400).json({
                    message:'user delete failed, cause database connection.'
                })
            }

            if(user.length <= 0){
                res.status(400).json({
                    message:'user id is missing or incorrect.'
                })
            } else {
                DB.delete('user', {
                    "_id": _id
                }, (error, data) => {
                    if (error) {
                        res.status(400).json({
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
        res.status(400).json({
            message:'Format of user id is incorrect.'
        })
    }
}



exports.getAllUsers = (req,res,next) =>{

    DB.find('user',{}, (error, users) =>{
        if (error) {
            return res.status(400).json({
                error: err
            })
        }

        var usersTemp = []
        for (index in users) {
            var user = {
                _id: users[index]._id,
                status: users[index].status,
                username: users[index].username,
                points: users[index].points,
                createTime: users[index].createTime,
            }
            console.log(user);
            usersTemp.push(user)
        }

        res.status(200).json({
            message:'Get all users successfully',
            count: users.length,
            users: usersTemp
        })

    })

}