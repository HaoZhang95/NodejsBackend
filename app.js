
const express=require('express');
const app=new express();
const session = require('express-session')
const md5 = require('md5-node')
const morgan= require('morgan')
const bodyParser= require('body-parser')

const admin = require('./routers/admin')
const index = require('./routers/index')
const userRouter = require('./routers/normal/routes/user');
const imageRouter = require('./routers/normal/routes/image');
const categoryRouter = require('./routers/normal/routes/category')

const port = process.env.PORT || 8888

console.log(md5('admin'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(session({
    secret: 'keyboard',     /* 字符创用于签名,随便写 */
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {maxAge: 30 * 1000 * 60},
}))

app.use('/', index)
app.use('/user', userRouter);
app.use('/image', imageRouter);
app.use('/category', categoryRouter);
app.use('/admin', admin)

app.listen(port);

