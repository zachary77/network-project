var express = require('express');
var logger = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');
const assert = require('assert');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressErrorHandler = require('express-error-handler');
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

app.use(favicon(path.join(__dirname, './public', 'travel_icon.ico')));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

//쿠키 미들웨어 등록
app.use(cookieParser());

//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
app.use(session({
    secret: 'networkprogramming',   
    resave: false,
    saveUninitialized: true
}));
//secret – 쿠키를 임의로 변조하는것을 방지하기 위한 값 입니다. 이 값을 통하여 세션을 암호화 하여 저장합니다.
//resave – 세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값입니다. express-session documentation에서는 이 값을 false 로 하는것을 권장하고 필요에 따라 true로 설정합니다.
//saveUninitialized – 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장합니다.

app.get('/', (req,res) => {
    res.sendfile('./public/travel.html');
});

app.post('/', (req,res) => {
    if(req.body.pw != req.body.check){
        res.send('<script type="text/javascript">alert("재입력한 비밀번호가 일치하지 않습니다.");</script>');
    }
    if(req.body.username && req.body.id && req.body.pw && req.body.check){
        var result = db.users.find({ id: `${req.body.username}`});
        
        result.toArray(function(err,docs){
            if(err){
                console.log(err.message)
            }
            if(docs.length > 0){
                res.send('<script type="text/javascript">alert("이미 존재하는 아이디입니다.");</script>');
            }else {
                db.users.insertOne({username: `${req.body.username}`, id: `${req.body.id}`, pw: `${req.body.pw}`},
                function(err,result){
                    if(err){
                        console.log(err.message);
                    }else{
                        console.log('사용자 추가 됨');
                        res.send('<script type="text/javascript">alert("회원가입이 완료 되었습니다.");</script>');
                    }
                });
            }
        });
    }
});

app.post('/login', (req,res) => {
    if(req.body.id && req.body.pw){
        
    }
    res.redirect('/');
});

var errorHandler = expressErrorHandler(
    { static: { '404': './public/404.html' } }              //404 에러 코드가 발생하면 해당 페이지를 보여주는 예외 미들웨어
);
 
app.use(expressErrorHandler.httpError(404));
app.use(expressErrorHandler);

app.listen(8080,()=>{
    console.log('8080 포트에서 대기중');
});