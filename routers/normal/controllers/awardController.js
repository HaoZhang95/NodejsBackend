
const DB = require('../../../modules/db')

const EACH_POINT = 10

exports.updatePoints = (req,res,next) =>{

    const userId = req.body.userId
    console.log(userId);
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
                DB.update('user',
                            {points: user[0].points},
                            {points: user[0].points + EACH_POINT},
                    (error, data) => {
                        if (error) {
                            return res.status(500).json({
                                error: error,
                                message:'Update points failed, Please try again.'
                            })
                        }
                        res.status(201).json({
                            message:'Update points successfully.',
                            user: {
                                _id: user[0]._id,
                                username: user[0].username,
                                createTime: user[0].createTime,
                                status: user[0].status,
                                points: user[0].points + EACH_POINT,
                            }

                        })
                    })

                // res.status(200).json({
                //     message:'Get user info sucessfully',
                //     user: {
                //         _id: user[0]._id,
                //         username: user[0].username,
                //         createTime: user[0].createTime,
                //         status: user[0].status
                //     }
                // })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of user id is incorrect.'
        })
    }

}
