
const DB = require('../../../modules/db')

exports.getAllCategories = (req,res,next)=>{

    DB.find('category', {}, (error, data) => {
        if (! error) {
            res.status(200).json({
                count: data.length,
                message:'Get all categories successfully.',
                category: data,
            });
        }else {
            res.status(500).json({
                message:'Get all categories failed.'
            });
        }
    })
}

exports.getCategoryById = (req,res,next) =>{

    const categoryId = req.params.categoryId
    var _id;

    try {
        _id = DB.ObjectID(categoryId)

        DB.find('category',{_id: _id},function (error, data) {
            if (error) {
                return res.status(500).json({
                    message:'Get category failed, cause database connection.',
                    error: error
                })
            }

            if(data.length <= 0){
                res.status(500).json({
                    message:'Category id is missing or incorrect.'
                })
            } else {
                res.status(200).json({
                    message:'Get category sucessfully.',
                    category: data[0]
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of category id is incorrect.',
        })
    }
}