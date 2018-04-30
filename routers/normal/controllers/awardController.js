const multiparty = require('multiparty')
const DB = require('../../../modules/db')

const EACH_POINT = 10

exports.updatePoints = (req,res,next) =>{

    const form = new multiparty.Form()

    form.parse(req, (error, textFields, files) => {
        const userId = textFields.userId[0]
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
                        message:'Get nothing with this user id or user id does not exist.'
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
                }
            })

        } catch (error) {
            res.status(500).json({
                message:'Format of user id is incorrect.'
            })
        }
    })



}
