require('dotenv').config;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config')
const articlesRouter = require('./article/articles-router')
const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/articles', articlesRouter)

app.get('/xss', (req,res) => {
    res.cookie('secretToken', '12345678');
    res.sendFile(__dirname + '/xss-example.html');
});

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error,req,res,next) {
    let response
    if(NODE_ENV === 'production') {
        response = {error: {message: 'server issue'}}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
})

module.exports = app;