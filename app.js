var express = require('express');
var logger = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');
const assert = require('assert');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressErrorHandler = require('express-error-handler');
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'test';

MongoClient.connect(url, function(err, client) {
    if(err){
        console.log(err.message);
    } else {
        console.log('db connection successed');
        db = client.db(dbName);
        db.users = db.collection('users');
    }
});

var app = express();

app.use(favicon(path.join(__dirname, '/public', 'travel_icon.ico')));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views','./views');

//쿠키 미들웨어 등록
app.use(cookieParser());

//세션 환경 세팅
app.use(session({
    key : 'sid', //세션 키
    secret: 'secret',   //세션 암호 키(쿠키값 변조를 막기 위한 암호화)
    resave: false,      //세션 항상 저장할지
    saveUninitialized: true,     //세션이 저장되기 전 상태를 지정하는 부분
    cookie: {        //쿠키 유효시간
        maxAge: 24000 * 60 * 60 //쿠기 유효시간 24시간
    }
}));
//secret – 쿠키를 임의로 변조하는것을 방지하기 위한 값 입니다. 이 값을 통하여 세션을 암호화 하여 저장합니다.
//resave – 세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값입니다. express-session documentation에서는 이 값을 false 로 하는것을 권장하고 필요에 따라 true로 설정합니다.
//saveUninitialized – 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장합니다.

app.get('/', (req,res) => {
    res.render('index', {session:req.session, cookie:req.cookies});
});

app.get('/intro', (req,res) => {
    res.render('intro', {session:req.session, cookie:req.cookies});
});

app.get('/login',function(req,res,next){
    let session = req.session;
    res.render("login",{
        session : session
    });
});

app.get('/join', (req,res) => {
    res.render('join');
});

app.post('/join', (req,res) => {
    if(req.body.pw != req.body.check){
        res.send('<script type="text/javascript">alert("재입력한 비밀번호가 일치하지 않습니다.");</script><script type="text/javascript">window.location="http://localhost:8080";</script>');
        return;
    }
    if(req.body.username && req.body.id && req.body.pw && req.body.check){
        var result = db.users.find({ id: `${req.body.id}` });
        result.toArray(function(err,docs){
            if(err){
                res.sendStatus(500);
                console.log(err.message);
                return;
            }
            if(docs.length > 0){
                res.send('<script type="text/javascript">alert("이미 존재하는 아이디입니다.");</script><script type="text/javascript">window.location="http://localhost:8080";</script>');
            }else {
                db.users.insertOne({username: `${req.body.username}`, id: `${req.body.id}`, pw: `${req.body.pw}`},
                function(err,result){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.insertedCount > 0){
                        console.log('사용자 추가 됨');
                        res.send('<script type="text/javascript">alert("회원가입에 성공하였습니다.");</script><script type="text/javascript">window.location="http://localhost:8080";</script>');
                    }else{
                        console.log('사용자 추가 안됨');
                        res.send('<script type="text/javascript">alert("회원가입에 실패하였습니다.");</script><script type="text/javascript">window.location="http://localhost:8080";</script>');
                    }
                });
            }
        });
    }
});

app.post('/login', (req,res) => {
        let body = req.body;
        var sec = db.users.find({ id: `${req.body.id}` , pw: `${req.body.pw}`});
        sec.toArray(function(err,docs){
            if(err){
                res.sendStatus(500);
                console.log(err.message);
                return;
            }
            if(docs.length <= 0){
                res.send('<script type="text/javascript">alert("아이디나 비밀번호가 틀렸습니다.");</script><script type="text/javascript">window.location="http://localhost:8080";</script>');
            }else{
                
                res.cookie("user", docs[0].username, {    //첫번째 인자는 쿠키 이름, 두번째 인자는 값, 세번째 인자는 옵션(expire : 소멸 시간, httpOnly : 웹 서버에서만 접근 가능하게 설정)
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                });
                req.session.islogin = 'login'

                res.send('<script type="text/javascript">alert("로그인에 성공하였습니다.");</script><script type="text/javascript">window.location="http://localhost:8080";</script>');
                console.log(req.cookies);
                console.log('사용자 로그인');
            } 
        });
});

app.get('/logout', (req, res)=> {
    req.session.islogin = ''
    res.redirect('/')
});

var errorHandler = expressErrorHandler(
    { static: { '404': './public/404.html' } }              //404 에러 코드가 발생하면 해당 페이지를 보여주는 예외 미들웨어
);
 
app.use(expressErrorHandler.httpError(404));
app.use(expressErrorHandler);

app.listen(8080,()=>{
    console.log('8080 포트에서 대기중');
});