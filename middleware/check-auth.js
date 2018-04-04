
const jwt=require('jsonwebtoken');
const keyForToken = 'secret'
module.exports = (req,res,next)=>{

    try{
        const token= req.headers['x-access-token'];
        console.log(token);

        jwt.verify(token, keyForToken, (err, authData) => {
            if(err) {
                return res.status(403).json({
                    message:'Token is missing or incorrect from check-auth class.'
                })
            } else {
                console.log('Token is correct. :) ');
                return next();
            }
        })

    }catch(error){
        return res.status(403).json({
            message:'Token is missing or incorrect.'
        })
    }
};