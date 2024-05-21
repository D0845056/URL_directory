var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//使用cors模組來解決跨域問題
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//使用sqlite3開啟db/sqlite.db的資料庫並確認是否開啟成功
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sqlite database.');
});

//如果不存在
//CREATE TABLE product_price_change (
//     product_year INTEGER PRIMARY KEY,
//     product_name TEXT NOT NULL,
//     product_price REAL
// );
//則建立一個新的資料表
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS product_price_change (product_year INTEGER PRIMARY KEY, product_name TEXT NOT NULL, product_price REAL)');
});

//撰寫 /api/getProductPriceChange API 來取得product_price_change資料表的product_price資料
app.get('/api/getProductPriceChange', function (req, res) {
    db.all('SELECT * FROM product_price_change', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

//get /api 路由 使用sqlite查詢某product_year的所有資料
app.get('/api/search', function (req, res) {
    db.all('SELECT * FROM product_price_change WHERE product_year = ?', [req.query.product_year], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

//get /api/check 路由 使用sqlite查詢某product_year到product_year的所有資料
app.get('/api/check', function (req, res) {
    db.all('SELECT * FROM product_price_change WHERE product_year >= ? AND product_year <= ?', [req.query.start_year, req.query.end_year], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.json(rows);
    });
});




module.exports = app;

