var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// default route
app.get('/', function(req, res) {
    return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api'
});
// connect to database
dbConn.connect();
// Retrieve all users 
app.get('/users', function(req, res) {
    dbConn.query('SELECT * FROM data', function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});
// Retrieve user with id 
app.get('/user/:id', function(req, res) {
    let user = req.params.id;
    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }
    dbConn.query('SELECT * FROM data where user=?', user, function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});
// Add a new user  
app.post('/user', function(req, res) {
    let user = req.body.user;
    let url = req.body.url;
    if (!user) {
        console.log(req);
        return res.status(400).send({ error: true, message: 'Please provide user not' + user });
    }
    dbConn.query("INSERT INTO data (user, url) VALUES ('" + user + "','" + url + "')", function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});
//  Update user with id
app.put('/user', function(req, res) {
    let user = req.body.user;
    let url = req.body.user;
    if (!user || !url) {
        return res.status(400).send({ error: user, message: 'Please provide user and user' });
    }
    dbConn.query("UPDATE data SET url = ? WHERE url = ?", [url, user], function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});
//  Delete user
app.delete('/user', function(req, res) {
    let user = req.body.user;
    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }
    dbConn.query('DELETE FROM data WHERE user = ?', [user], function(error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
});
// set port

const PORT = process.env.PORT || 8000;
app.listen(PORT, function() {
    console.log('Node app is running on port 3000');
});
module.exports = app;