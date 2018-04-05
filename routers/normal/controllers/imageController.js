
const multiparty = require('multiparty')
const DB = require('../../../modules/db')

exports.doUpload = (req,res,next) =>{

    const form = new multiparty.Form()

    form.uploadDir = 'uploads'      /* 上传的文件夹必须存在 */

    form.parse(req, (error, textFields, files) => {

        try {
            const userId = textFields.userId[0]
            const category = textFields.category[0]
            const pic = files.pic[0].path

            console.log(userId);
            _id = DB.ObjectID(userId)
            console.log(_id);

            const obj = {
                userId: userId,
                _id: new DB.ObjectID,
                category:category,
                createTime: new Date(),
                pic: pic,
                status: 0
            }

            DB.insert('image', obj, (error, data) => {
                console.log(data);
                if (! error) {
                    res.status(201).json({
                        message:'Image upload successfully.',
                        image: obj
                    });
                }else {
                    res.status(500).json({
                        message:'Image upload failed.'
                    });
                }
            })

        } catch (error) {
            res.status(500).json({
                message:'Format of user id is incorrect or other attributes missing.',
            })
        }

    })
}

exports.getImagesByUserId = (req,res,next) =>{

    const userId = req.params.userId
    console.log(userId);
    var _id;

    try {
        _id = DB.ObjectID(userId)

        DB.find('image',{userId: userId}, (error, images) =>{
            if (error) {
                return res.status(500).json({
                    message:'Get images failed, cause database connection.',
                    error: error
                })
            }

            if(images.length <= 0){
                res.status(500).json({
                    message:'Get nothing with this user id.'
                })
            } else {
                res.status(200).json({
                    message:'Get images sucessfully.',
                    images: images
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of user id is incorrect or missing.',
        })
    }
}

exports.doImageDelete = (req,res,next) =>{

    const imageId = req.params.imageId
    var _id;

    try {
        _id = DB.ObjectID(imageId)

        DB.find('image',{_id: _id}, (error, image) =>{
            if (error) {
                return res.status(500).json({
                    message:'image delete failed, cause database connection.'
                })
            }

            if(image.length <= 0){
                res.status(500).json({
                    message:'imageId id is missing or incorrect. '
                })
            } else {
                DB.delete('image', {
                    "_id": _id
                }, (error, data) => {
                    if (error) {
                        res.status(500).json({
                            message:'image delete failed.',
                        })
                    } else {
                        res.status(200).json({
                            message:'image delete sucessfully',
                            deleteTime: new Date(),
                            deleteImage: image[0]
                        })
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of image id is incorrect. '
        })
    }
}