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
var db = new sqlite3.Database('db/url.db', (err) => {
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
    db.run('CREATE TABLE IF NOT EXISTS URL (id INTEGER PRIMARY KEY AUTOINCREMENT, url_name TEXT NOT NULL, url_illustrate TEXT NOT NULL, url TEXT NOT NULL)');
});

//撰寫 /api/getProductPriceChange API 來取得product_price_change資料表的product_price資料
app.get('/api/getUrl', function (req, res) {
    db.all('SELECT * FROM URL', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

//get /api 路由 使用sqlite查詢含有某字串的資料 只要url_name url_illustrate url 任意一個有該字串就回傳
app.get('/api/search', function (req, res) {
    db.all('SELECT * FROM URL WHERE url_name LIKE ? OR url_illustrate LIKE ? OR url LIKE ?', [`%${req.query.keyword}%`, `%${req.query.keyword}%`, `%${req.query.keyword}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.json(rows);
    });
});


//撰寫 get /api/insert 路由，使用 SQLite 新增一筆網址資料 (url_name, url, url_illustrate)，回傳文字訊息，不要 json
app.get('/api/insert', function (req, res) {
    db.run('INSERT INTO URL (url_name, url, url_illustrate) VALUES (?, ?, ?)', [req.query.url_name, req.query.url, req.query.url_illustrate], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.send('新增成功');
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

//撰寫 get /api/update 路由，刪除特定id的所有資料
app.get('/api/delete', function (req, res) {
    db.run('DELETE FROM URL WHERE id = ?', [req.query.id], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.send('刪除成功');
    });
});




module.exports = app;

